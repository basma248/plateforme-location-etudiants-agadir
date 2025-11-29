<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'content',
        'sujet',
        'telephone',
        'date_visite',
        'lu',
    ];

    protected $casts = [
        'date_visite' => 'date',
        'lu' => 'boolean',
        'created_at' => 'datetime',
    ];

    // Relations
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    // Scopes
    public function scopeUnread($query)
    {
        return $query->where('lu', false);
    }

    public function scopeBySender($query, $senderId)
    {
        return $query->where('sender_id', $senderId);
    }

    public function scopeInConversation($query, $conversationId)
    {
        return $query->where('conversation_id', $conversationId);
    }

    // Methods
    public function markAsRead()
    {
        $this->update(['lu' => true]);
    }

    public function isFromUser($userId)
    {
        return $this->sender_id === $userId;
    }

    public function isInitialContact()
    {
        return !empty($this->sujet) && !empty($this->telephone);
    }
}