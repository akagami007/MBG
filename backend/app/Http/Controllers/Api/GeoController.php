<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Organization;
use App\Models\Incident;

class GeoController extends Controller
{
    /**
     * Get Network GeoJSON
     * Returns the supply chain network (Suppliers, SPPGs, Schools)
     * GET /api/geo/network
     */
    public function getNetwork()
    {
        $orgs = DB::table('organizations')
            ->select(
                'id',
                'name',
                'type',
                'address',
                DB::raw('ST_AsGeoJSON(location) as geometry')
            )
            ->whereNotNull('location')
            ->get();

        $features = [];
        foreach ($orgs as $org) {
            if (!$org->geometry) continue;
            $features[] = [
                'type' => 'Feature',
                'geometry' => json_decode($org->geometry),
                'properties' => [
                    'id' => $org->id,
                    'name' => $org->name,
                    'type' => $org->type,
                    'address' => $org->address
                ]
            ];
        }

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features
        ]);
    }

    /**
     * Get Incidents GeoJSON (Heatmap)
     * GET /api/geo/incidents
     */
    public function getIncidents()
    {
        // Incidents might not have a direct location if they are tied to a school.
        // Let's get incidents that have a location, OR fallback to destination_school location.
        $incidents = DB::table('incidents')
            ->leftJoin('organizations', 'incidents.destination_school_id', '=', 'organizations.id')
            ->select(
                'incidents.id',
                'incidents.category',
                'incidents.severity',
                'incidents.status',
                'incidents.description',
                DB::raw('COALESCE(ST_AsGeoJSON(incidents.location), ST_AsGeoJSON(organizations.location)) as geometry')
            )
            ->get();

        $features = [];
        foreach ($incidents as $inc) {
            if (!$inc->geometry) continue;
            $features[] = [
                'type' => 'Feature',
                'geometry' => json_decode($inc->geometry),
                'properties' => [
                    'id' => $inc->id,
                    'category' => $inc->category,
                    'severity' => $inc->severity,
                    'status' => $inc->status,
                    'description' => $inc->description
                ]
            ];
        }

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features
        ]);
    }
}
