export function countLines(text) {
    let count =  0;
    let pos   = -1;

    do {
        pos = text.indexOf("\n", pos + 1);
        if (pos >= 0) {
            count++;
        }
    }
    while (pos >= 0);

    return count + 1;
}