<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('distributions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('production_batch_id')->index();
            $table->uuid('destination_school_id')->index();
            $table->timestampTz('dispatch_time')->nullable();
            $table->timestampTz('receipt_time')->nullable();
            $table->string('status', 50)->nullable();
            $table->string('source_system', 100)->nullable();
            $table->string('source_ref')->nullable();
            $table->timestamps();

            $table->foreign('production_batch_id')->references('id')->on('production_batches')->onDelete('cascade');
            $table->foreign('destination_school_id')->references('id')->on('organizations');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('distributions');
    }
};
