<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Organization;
use App\Models\Incident;
use App\Models\ProductionBatch;

class CopilotController extends Controller
{
    /**
     * Handle NLP Chat Queries from AI Copilot Widget
     */
    public function chat(Request $request)
    {
        $message = strtolower($request->input('message', ''));
        
        $response = "";
        
        // Simple NLP Keyword matching for MVP demo
        if (str_contains($message, 'sppg terburuk') || str_contains($message, 'skor terendah') || str_contains($message, 'peringkat bawah')) {
            $worstSppgs = Organization::whereIn('type', ['SPPG'])
                            ->orderBy('trust_score', 'asc')
                            ->limit(3)
                            ->get();
            
            $response = "Berikut adalah 3 SPPG dengan **skor kepercayaan terburuk** saat ini:\n\n";
            foreach ($worstSppgs as $idx => $sppg) {
                $response .= ($idx + 1) . ". **{$sppg->name}** (Skor: {$sppg->trust_score}) - Status: `{$sppg->trust_status}`\n";
            }
            $response .= "\nSaya menyarankan untuk segera mengirimkan Auditor Lapangan ke SPPG di atas.";
            
        } elseif (str_contains($message, 'insiden') || str_contains($message, 'masalah') || str_contains($message, 'anomali')) {
            $criticalIncidents = Incident::where('severity', 'CRITICAL')->whereNotIn('status', ['RESOLVED', 'DISMISSED'])->count();
            $highIncidents = Incident::where('severity', 'HIGH')->whereNotIn('status', ['RESOLVED', 'DISMISSED'])->count();
            
            $response = "Terdapat **{$criticalIncidents} insiden KRITIS** dan **{$highIncidents} insiden TINGGI** yang saat ini masih aktif dan belum diselesaikan.\n\nSebagian besar dipicu oleh anomali suhu (Temperature Anomaly) di luar batas aman 25°C.";
            
        } elseif (str_contains($message, 'halo') || str_contains($message, 'hai') || str_contains($message, 'bantuan')) {
            $response = "Halo, Auditor! Saya adalah **SafeTrace Copilot**. Anda bisa bertanya kepada saya mengenai data rantai pasok, seperti:\n- *Tampilkan SPPG dengan skor terburuk*\n- *Berapa banyak insiden kritis yang aktif?*";
        } else {
            $response = "Maaf, sebagai prototipe MVP v0.6, saya baru mempelajari beberapa instruksi. Coba tanyakan tentang **skor SPPG terburuk** atau **status insiden aktif**.";
        }

        // Simulate thinking delay for realism
        sleep(1);

        return response()->json([
            'success' => true,
            'reply' => $response
        ]);
    }
}
