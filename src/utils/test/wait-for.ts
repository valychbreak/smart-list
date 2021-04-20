async function waitFor(callback: any, timeout = 500) {
    const step = 10;
    let timeSpent = 0;
    let timedOut = false;

    let occurredError;

    while (true) {
        try {
            await new Promise((r) => setTimeout(r, step));
            timeSpent += step;
            callback();
            break;
        } catch (error) {
            occurredError = error;
        }
        if (timeSpent >= timeout) {
            timedOut = true;
            break;
        }
    }

    if (timedOut) {
        throw occurredError || new Error("Timeout: unknow error");
    }
}

export default waitFor;
