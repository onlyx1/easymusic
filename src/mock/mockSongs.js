function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function padNumber(number) {
    return number.toString().padStart(2, '0');
}

const audioFiles = [
    { file: '/src/assets/music/1.mp3', duration: 235 }, // 3:55
    { file: '/src/assets/music/2.mp3', duration: 248 }, // 4:08
    { file: '/src/assets/music/3.mp3', duration: 221 }, // 3:41
    { file: '/src/assets/music/4.mp3', duration: 256 }  // 4:16
];
const imageFiles = Array.from({ length: 4 }, (_, i) => `/src/assets/img/${i + 1}.jpg`);

const artists = ["周杰伦", "林俊杰", "陈奕迅", "Taylor Swift", "Ed Sheeran", "Adele", "邓紫棋", "五月天", "张学友", "李荣浩"];
const albums = ["Jay", "JJ陆", "U87", "1989", "÷", "25", "新的心跳", "自传", "学友光年", "有理想"];

const countries = ["华语", "欧美", "韩国", "日本"];
const genres = ["流行", "摇滚", "民谣", "电子", "嘻哈", "R&B"];

function getRandomTags() {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const genre = genres[Math.floor(Math.random() * genres.length)];
    return [country, genre];
}

export const mockSongs = Array.from({ length: 150 }, (_, index) => {
    const releaseDate = getRandomDate(new Date(2000, 0, 1), new Date());
    const audioFileIndex = Math.floor(Math.random() * audioFiles.length);
    const tags = getRandomTags();
    return {
        id: index + 1,
        name: `歌曲${padNumber(index + 1)}`,
        artist: artists[Math.floor(Math.random() * artists.length)],
        album: albums[Math.floor(Math.random() * albums.length)],
        url: audioFiles[audioFileIndex].file,
        coverUrl: imageFiles[Math.floor(Math.random() * imageFiles.length)],
        releaseDate: releaseDate.toISOString().split('T')[0], // 格式化为 YYYY-MM-DD
        duration: audioFiles[audioFileIndex].duration, // 使用预设的音频时长
        tags: tags
    };
});