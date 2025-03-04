export const Priority = Object.freeze({
    Lowest:   0,
    Low:      1,
    Medium:   2,
    Hight:    3,
    Critical: 4
});

export function getPriorityName(priority) {
    switch (priority) {
        case 0: return "lowest";
        case 1: return "low";
        case 2: return "medium";
        case 3: return "high";
        case 4: return "critical";
    }
}