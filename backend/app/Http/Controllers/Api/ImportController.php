<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ImportService;

class ImportController extends Controller
{
    protected $importService;

    public function __construct(ImportService $importService)
    {
        $this->importService = $importService;
    }

    /**
     * Upload CSV file for Supplier Lots bulk import
     */
    public function importSupplierLots(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240', // Max 10MB
        ]);

        try {
            $result = $this->importService->importSupplierLots($request->file('file'));
            
            return response()->json([
                'success' => true,
                'message' => 'Import processed.',
                'data' => $result
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process import: ' . $e->getMessage()
            ], 500);
        }
    }
}
