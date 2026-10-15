<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('batch_components', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('production_batch_id')->index();
            $table->uuid('supplier_lot_id')->index();
            $table->decimal('quantity_used', 10, 2);
            $table->timestamps();

            $table->foreign('production_batch_id')->references('id')->on('production_batches')->onDelete('cascade');
            $table->foreign('supplier_lot_id')->references('id')->on('supplier_lots')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('batch_components');
    }
};
