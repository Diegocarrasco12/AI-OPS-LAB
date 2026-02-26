const experiences = new Map();

/*
Pattern Learning Record

patternId:
{
   successes,
   failures,
   confidence
}
*/

export function recordExperience(patternId, success) {

    const exp = experiences.get(patternId) || {
        successes: 0,
        failures: 0,
        confidence: 0.5
    };

    if (success) exp.successes++;
    else exp.failures++;

    const total = exp.successes + exp.failures;

    exp.confidence = exp.successes / total;

    experiences.set(patternId, exp);
}

export function getExperience(patternId) {
    return experiences.get(patternId);
}
