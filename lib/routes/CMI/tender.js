const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {	
	const response = await got({
        method: 'get',
        url: 'https://www.cmi.chinamobile.com/sc/tender',
        headers: {
            Referer: 'https://www.cmi.chinamobile.com/sc',
        },
    });
	
    const data = response.data;
	const $ = cheerio.load(data);
	
	const list = $('.collaItem')
		.slice(0, 30)
        .get();
    const out = await Promise.all(
        list.map(async (i) => {
            const item = $(i);
            const title = $(item.collaTitle)
				.find('h2')
                .text();
            const content = $(item.collaContent)
				.find('p')
                .html()
				.replace(/<br>/g, "<br />");
            const rawtime = $(item.collaTitle.collaTime)
                .text();
			
            const time = new Date(rawtime);
			
			const link =  "https://www.cmi.chinamobile.com/sc/tender?title=" + title.replace(/ /g, "");
			
            const single = {
                title: title,
                description: content,
                pubDate: time.toUTCString(),
                link: link,
                guid: link,
            };
			
            return Promise.resolve(single);
        })
    );

    ctx.state.data = {
        title: `China Mobile International Tender Notice`,
		link: `https://www.cmi.chinamobile.com/sc/tender`,
        item: out
    };
};