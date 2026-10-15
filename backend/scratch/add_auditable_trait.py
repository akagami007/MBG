import os

models = [
    'SupplierLot.php',
    'ProductionBatch.php',
    'Incident.php',
    'Distribution.php'
]

base_path = '/Users/akagami/Documents/GitHub/MBG/backend/app/Models/'

for model in models:
    path = os.path.join(base_path, model)
    with open(path, 'r') as f:
        content = f.read()
    
    if 'use App\Traits\Auditable;' not in content:
        # Add the import after the namespace or other imports
        content = content.replace('use Illuminate\Database\Eloquent\Model;', 'use Illuminate\Database\Eloquent\Model;\nuse App\Traits\Auditable;')
        
        # Add the trait inside the class
        content = content.replace('use HasUuids;', 'use HasUuids, Auditable;')
        
        with open(path, 'w') as f:
            f.write(content)
        print(f"Updated {model}")
