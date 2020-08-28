const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {	
	const response = await got({
        rejectUnauthorized: false,
        method: 'get',
        url: 'https://www.cmi.chinamobile.com/CompanyBiddingList?lang=zh-hans',
        headers: {
            'referer': 'https://www.cmi.chinamobile.com/sc',
			'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
        },
    });
	
    const data = response.data;

    ctx.state.data = {
        title: `China Mobile International Tender Notice`,
		link: `https://www.cmi.chinamobile.com/sc/tender`,
        item: data.map((item) => ({
            title: item.tenderTitle.normalize(),
            description: item.announcementDetails.normalize(),
            pubDate: new Date(item.dataTime).toUTCString(),
            link: `https://www.cmi.chinamobile.com/sc/tender?title=${item.title}`,
        })),
    };
};
