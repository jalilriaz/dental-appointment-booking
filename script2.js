const run = async () => {
    try {
        const response = await fetch('https://www.google.com/maps/search/D-Watson+Chemist+F-10+Markaz+Islamabad');
        const text = await response.text();
        const match = text.match(/1m18[^\"]+/g);
        if (match) {
            console.log(match[0]);
        } else {
            console.log("no match");
        }
    } catch (err) {
        console.error(err);
    }
};
run();
