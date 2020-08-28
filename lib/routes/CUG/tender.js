const got = require('@/utils/got');

module.exports = async (ctx) => {

    const response = await got({
        method: 'post',
        url: 'https://etender.chinaunicomglobal.com:8081/ebvp/index/indexlog/zbgggengajax',
    });
	
	const data = response.data;
	
    ctx.state.data = {
        title: `China Unicom Global Tender Notice`,
        link: `https://etender.chinaunicomglobal.com:8081/supp/index.html#/tenderNotice`,
        description: `China Unicom Global Tender Notice`,
        item: data.map((item) => ({
            title: item.name,
            description: item.content.replace(/\n/g, "<br />"),
            pubDate: new Date(item.date).toUTCString(),
            link: `https://etender.chinaunicomglobal.com:8081${item.url}`,
        })),
    };
};
