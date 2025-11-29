<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Annonce;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AnnonceController extends Controller
{
    public function index(Request $request)
    {
        $query = Annonce::query();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('titre', 'like', "%{$s}%")
                  ->orWhere('description', 'like', "%{$s}%")
                  ->orWhere('zone', 'like', "%{$s}%");
            });
        }

        foreach (['type','zone'] as $f) {
            if ($request->filled($f)) $query->where($f, 'like', "%".$request->get($f)."%");
        }

        if ($request->filled('prixMin')) $query->where('prix', '>=', intval($request->prixMin));
        if ($request->filled('prixMax')) $query->where('prix', '<=', intval($request->prixMax));
        if ($request->filled('surfaceMin')) $query->where('surface', '>=', intval($request->surfaceMin));
        if ($request->filled('nbChambres')) $query->where('nb_chambres', intval($request->nbChambres));
        if ($request->filled('meuble')) $query->where('meuble', $request->meuble === 'true' || $request->meuble == 1);

        // pagination compatible avec React (page param)
        $perPage = $request->get('perPage', 12);
        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function show($id)
    {
        return Annonce::findOrFail($id);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Annonce::class);

        $v = Validator::make($request->all(), [
            'titre' => 'required|string',
            'prix' => 'nullable|integer',
            'description' => 'nullable|string',
            'zone' => 'nullable|string',
            'type' => 'nullable|string',
            'images' => 'nullable|array'
        ]);
        if ($v->fails()) return response()->json(['errors'=>$v->errors()], 422);

        $data = $v->validated();
        $data['user_id'] = Auth::id();

        $annonce = Annonce::create($data);
        return response()->json($annonce, 201);
    }

    public function update(Request $request, $id)
    {
        $annonce = Annonce::findOrFail($id);
        $this->authorize('update', $annonce);

        $annonce->update($request->only(['titre','description','prix','zone','type','images','surface','nb_chambres','meuble']));
        return response()->json($annonce);
    }

    public function destroy($id)
    {
        $annonce = Annonce::findOrFail($id);
        $this->authorize('delete', $annonce);
        $annonce->delete();
        return response()->json(null, 204);
    }
}