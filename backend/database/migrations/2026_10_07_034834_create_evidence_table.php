<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evidence', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('entity_type', 100);
            $table->uuid('entity_id');
            $table->string('source_type', 100);
            $table->string('uri', 512)->nullable();
            $table->string('file_checksum')->nullable();
            $table->timestampTz('observed_time')->nullable();
            $table->enum('status', ['UPLOADED', 'SCANNED', 'UNVERIFIED', 'VERIFIED', 'REJECTED'])->default('UNVERIFIED');
            $table->boolean('is_stale')->default(false);
            $table->timestamps();
            
            $table->index(['entity_type', 'entity_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evidence');
    }
};
