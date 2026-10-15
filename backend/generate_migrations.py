import os

migrations = {
    "database/migrations/0001_01_01_000000_create_users_table.php": """<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id')->nullable();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['QUALITY_REVIEWER', 'AUDITOR', 'DATA_STEWARD', 'SUPPLIER_CONTACT', 'PIC_SCHOOL'])->default('PIC_SCHOOL');
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
""",
    "database/migrations/2026_10_07_034828_create_organizations_table.php": """<?php

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
""",
    "database/migrations/2026_10_07_034829_create_supplier_lots_table.php": """<?php

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
""",
    "database/migrations/2026_10_07_034830_create_production_batches_table.php": """<?php

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
""",
    "database/migrations/2026_10_07_034831_create_batch_components_table.php": """<?php

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
""",
    "database/migrations/2026_10_07_034832_create_distributions_table.php": """<?php

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
""",
    "database/migrations/2026_10_07_034833_create_incidents_table.php": """<?php

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
""",
    "database/migrations/2026_10_07_034834_create_evidence_table.php": """<?php

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
""",
    "database/migrations/2026_10_07_034835_create_audit_logs_table.php": """<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('action', 100); // CREATE, UPDATE, DELETE, IMPORT, VERIFY, EXPORT
            $table->string('entity_type', 100);
            $table->uuid('entity_id')->nullable();
            $table->jsonb('payload')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
"""
}

for filepath, content in migrations.items():
    with open(filepath, 'w') as f:
        f.write(content)
print("Migrations updated successfully.")

