<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\SupplierLot;

class ImportService
{
    /**
     * Parse and import Supplier Lots from a CSV file.
     * Expected CSV headers: supplier_id, lot_code, commodity, quantity, unit, received_at
     */
    public function importSupplierLots(UploadedFile $file): array
    {
        $path = $file->getRealPath();
        $csvData = array_map('str_getcsv', file($path));
        
        $headers = array_shift($csvData);
        // Normalize headers
        $headers = array_map('trim', $headers);
        $headers = array_map('strtolower', $headers);

        $insertedCount = 0;
        $errors = [];

        DB::beginTransaction();

        try {
            foreach ($csvData as $index => $row) {
                // Skip empty rows
                if (empty(array_filter($row))) {
                    continue;
                }

                $rowNumber = $index + 2; // +1 for 0-index, +1 for header

                // Map row to headers
                if (count($headers) !== count($row)) {
                    $errors[] = [
                        'row' => $rowNumber,
                        'message' => 'Column count mismatch. Expected ' . count($headers) . ' columns.'
                    ];
                    continue;
                }

                $data = array_combine($headers, $row);

                // Validate row
                $validator = Validator::make($data, [
                    'supplier_id' => 'required|uuid|exists:organizations,id',
                    'lot_code' => 'required|string|max:100',
                    'commodity' => 'required|string|max:100',
                    'quantity' => 'required|numeric|min:0.01',
                    'unit' => 'required|string|max:20',
                    'received_at' => 'required|date',
                ]);

                if ($validator->fails()) {
                    $errors[] = [
                        'row' => $rowNumber,
                        'errors' => $validator->errors()->toArray()
                    ];
                    continue; // Skip this row, but continue processing others
                }

                // Insert or Update logic (Upsert-like behavior to avoid duplicate lot codes from same supplier)
                $existingLot = SupplierLot::where('supplier_id', $data['supplier_id'])
                                          ->where('lot_code', $data['lot_code'])
                                          ->first();

                if ($existingLot) {
                    $errors[] = [
                        'row' => $rowNumber,
                        'message' => 'Duplicate lot_code for this supplier.'
                    ];
                    continue;
                }

                SupplierLot::create([
                    'supplier_id' => $data['supplier_id'],
                    'lot_code' => $data['lot_code'],
                    'commodity' => $data['commodity'],
                    'quantity' => $data['quantity'],
                    'unit' => $data['unit'],
                    'received_at' => $data['received_at']
                ]);

                $insertedCount++;
            }

            if (count($errors) > 0) {
                // If we require atomic full import, we would rollback here.
                // For bulk import, we'll commit what succeeds and return errors for what fails.
                // In some strict environments: DB::rollBack();
            }
            
            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return [
            'success' => true,
            'inserted_rows' => $insertedCount,
            'failed_rows' => count($errors),
            'errors' => $errors
        ];
    }
}
