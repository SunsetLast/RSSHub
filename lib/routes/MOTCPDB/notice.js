const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: 'https://www.motcmpb.gov.tw/Information/Notice?SiteId=1&NodeId=483',
        headers: {
            Referer: 'https://www.motcmpb.gov.tw/',
        },
    });

    const data = response.data;
    const $ = cheerio.load(data);
	
	const list = $('.contents2 dl:not(.con-title)')
        .get();
		
    const out = await Promise.all(
        list.map(async (i) => {
            const item = $(i);
            const title = $(item)
                .find('dd a')
                .text();
            const content = $(item)
                .find('dd a')
                .html()
            const rawtime = $(item)
                .find('dt:nth-child(2) div')
                .text();
            const rawlink = $(item)
                .find('dd a')
                .attr('href');
			
            const time = new Date(rawtime);
			
			const link = rawlink.replace(/\/Information/g, "https://www.motcmpb.gov.tw/Information")
			
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
        title: `交通部航港局 - 航船布告`,
		link: `https://www.motcmpb.gov.tw/Information/Notice?SiteId=1&NodeId=483`,
		item: out
    };
};