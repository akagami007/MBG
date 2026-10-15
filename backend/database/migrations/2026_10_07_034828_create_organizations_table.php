<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->enum('type', ['SPPG', 'SCHOOL', 'SUPPLIER', 'PARTNER', 'BGN_INTERNAL']);
            $table->geometry('location', subtype: 'point', srid: 4326)->nullable(); // WGS84
            $table->text('address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('source_system', 100)->nullable();
            $table->string('source_ref')->nullable();
            $table->timestamps();
        });
        
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('organization_id')->references('id')->on('organizations')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['organization_id']);
        });
        Schema::dropIfExists('organizations');
    }
};
