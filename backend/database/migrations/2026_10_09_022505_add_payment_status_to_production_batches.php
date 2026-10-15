<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('production_batches', function (Blueprint $table) {
            // PENDING, RELEASED, FROZEN
            $table->string('payment_status', 50)->default('PENDING')->after('production_time');
            $table->decimal('escrow_amount', 15, 2)->default(0)->after('payment_status'); // The monetary value of this batch
        });
    }

    public function down(): void
    {
        Schema::table('production_batches', function (Blueprint $table) {
            $table->dropColumn(['payment_status', 'escrow_amount']);
        });
    }
};
