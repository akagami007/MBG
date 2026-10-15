<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplier_lots', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('supplier_id')->index();
            $table->string('commodity');
            $table->string('lot_code', 100);
            $table->decimal('quantity', 10, 2);
            $table->string('unit', 50);
            $table->timestampTz('received_at');
            $table->string('source_system', 100)->nullable();
            $table->string('source_ref')->nullable();
            $table->timestampTz('retrieval_time')->nullable();
            $table->timestamps();

            $table->foreign('supplier_id')->references('id')->on('organizations');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supplier_lots');
    }
};
