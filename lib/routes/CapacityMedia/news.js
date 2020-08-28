const got = require('@/utils/got');

module.exports = async (ctx) => {

    const response = await got({
		method: 'get',
		url: `https://www.capacitymedia.com/searchresults?itemsperpage=20&keyword=Submarine%20Cable`,
		headers: {
			Referer: `https://www.capacitymedia.com`,
		},
	});
	
	const data = response.data;
	
    ctx.state.data = {
        title: `Capacity Media`,
        link: `https://www.capacitymedia.com/search/Submarine%20Cable`,
        description: `Capacity Media Cable News`,
        item: data.SearchResults.map((item) => ({
            title: item.Title,
            description: "<img src= 'https://www.capacitymedia.com/Image/ServeImage?id=" + item.MainFileId + "&w=720&h=408&cr=true'></img>" + "<p>" +item.Extract + "</p>",
            pubDate: new Date(+item.Date.replace(/\/|"\"|\)|\(|Date/g, "")).toUTCString(),
            link: 'https://www.capacitymedia.com' + item.ArticleUrl,
        })),
    };
};
