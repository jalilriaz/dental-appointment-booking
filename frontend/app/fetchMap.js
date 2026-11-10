const getPb = async () => {
    try {
        const response = await fetch('https://www.google.com/maps/search/D-Watson+Chemist+F-10+Markaz+Islamabad');
        const text = await response.text();
        // Look for the pb string in the HTML
        // Usually it's something like "https://www.google.com/maps/embed?pb=..."
        const match = text.match(/https:\/\/www\.google\.com\/maps\/embed\?pb=([^"\\]+)/);
        if (match) {
            console.log(match[0]);
        } else {
            console.log("No pb found");
            // Alternatively, look for [1,[1m18... something like that
            const pbMatch = text.match(/\["(1m18[^"]+)"\]/);
            if (pbMatch) {
                 console.log("pb=" + pbMatch[1]);
            }
        }
    } catch(err) {
        console.error(err);
    }
};

getPb();
