const got = require('@/utils/got');
const cheerio = require('cheerio');

const base = "http://ecs.mnr.gov.cn/tzgg/"

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: 'http://101.231.140.106/tzgg/',
        headers: {
            Referer: 'http://ecs.mnr.gov.cn/',
        },
    });

    const data = response.data;
    const $ = cheerio.load(data);
	
	const list = $('.left_top .common_ul li')
        .map((index, item) => {
			item1 = $(item).find('p a:nth-child(2)')
            item2 = $(item).find('span');
            return {
				pubtime: new Date(item2.text()),
                title: item1.text(),
                link: base + item1.attr('href').replace("./", ""),
            };
        })
        .get();
		
    const items = await Promise.all(
        [...list].map(async ({ title, link, pubtime }) => {
            
			
			const item = {
                title: title,
                link: link,
				pubDate: pubtime.toUTCString(),
            };
			
            const response = await got({
                method: 'get',
                url: link,
            });
            const $ = cheerio.load(response.data);
            item.description = $('.TRS_Editor').html();
            return Promise.resolve(item);
        })
    );
	
	
    ctx.state.data = {
        title: `国家海洋局东海分局 - 通知公告`,
		link: `http://ecs.mnr.gov.cn/tzgg/`,
		item: items
    };
};