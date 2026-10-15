<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_batches', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('sppg_id')->index();
            $table->string('batch_code', 100)->unique();
            $table->string('menu_label');
            $table->decimal('quantity', 10, 2);
            $table->timestampTz('production_time');
            $table->string('source_system', 100)->nullable();
            $table->string('source_ref')->nullable();
            $table->timestamps();

            $table->foreign('sppg_id')->references('id')->on('organizations');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_batches');
    }
};
