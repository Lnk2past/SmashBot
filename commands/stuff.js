module.exports = 
{
get_cool_phrase: function() {
    idx = Math.floor(Math.random() * cool_phrases.length);
    return cool_phrases[idx];
}
}

var cool_phrases = [
    'HIT HIM WITH A SMASH ATTACK',
    'Every day I\'m SHFFL\'n',
    'Wanna smash?',
    'Wanna smush?',
    'MELEE?',
    'I tap to jump',
    'I grab with B'
];
