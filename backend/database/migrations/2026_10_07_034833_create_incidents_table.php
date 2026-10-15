<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('reporter_id')->nullable()->index();
            $table->uuid('destination_school_id')->nullable()->index();
            $table->uuid('production_batch_id')->nullable()->index();
            $table->string('category', 100);
            $table->text('description');
            $table->enum('severity', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
            $table->enum('status', ['DRAFT', 'SUBMITTED', 'TRIAGED', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'])->default('DRAFT');
            $table->timestampTz('observed_time');
            $table->geometry('location', subtype: 'point', srid: 4326)->nullable();
            $table->timestamps();

            $table->foreign('reporter_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('destination_school_id')->references('id')->on('organizations')->nullOnDelete();
            $table->foreign('production_batch_id')->references('id')->on('production_batches')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};
