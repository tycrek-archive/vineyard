# vineyard
A searchable archive of videos from Vine.

The latest stable-ish live version is available at [vineyard.jmoore.dev](https://vineyard.jmoore.dev).

## About

Vineyard is a website that lets you search and view Vines from the now defunct social network [Vine](https://vine.co/). Vine never had a great search function and their so-called "archive" is unusable, so this project aims to serve as a way to remedy that.

### How

The websites results are provided by my own database instead of the official Vine API. I do this because their API is very locked down and will eventually close for good. My othe project [node-vinescrape](https://github.com/tycrek/node-vinescrape) is currently scraping as many Vines as possible and saving the data in my database*. For more info on the scraping, check out that project.

By using my own SQL database, I am able to implement a search function and add ways to make searching easier.

### Why

My friends and I always reference classic Vines and sometimes want to look them up again. *Sometimes* YouTube works, but many Vines are not uploaded individually and are lost in 15 minute compilations. Some aren't available at all. I wanted to make it easier for people to find old Vines.

"But just use TikTok!" Absolutely not. End of conversation.

### Searching and tagging

The search function uses two methods:

- description
- tags

The description is just the description that the original poster wrote for the Vine, so that data is already accessible. However, many users didn't provide descriptions, making them much more difficult to search. To fix this, I added **tagging**.

The database includes a column of my own called `tags`, which is an array of words that describe or transcribe the video. The array can be filled with anything relevant, including the words spoken, music playing, the location, descriptions of people, etc etc.

Tags are added to Vines by two methods:

- crowd-sourcing
- speech-to-text (*not currently implemented*)

The site primarily functions using a "random" button which gives a random Vine. There is a tagging section on the video player page which lets users input tags to make the video easier to search for.

Speech-to-text is a bit more complicated. I've already decided to **not** use cloud services for this because it will very quickly become very expensive. Instead, I am looking into open-source projects I can run locally. This has issues of it's own, as described in the Video Files section.

### Video files

Despite me scraping the Vine data and putting it on my database, I am **not** saving the video files (yet). Storage isn't cheap, and that (among other things) is what killed [the last version of this project](https://github.com/tycrek-archive/vinescrape). For now, I can only hope they keep the videos online and publicly available until I figure out how and where to download them.

However, this time I am planning on only downloading just the "popular" Vines. Popular Vines are those which have over a certain amount of loops, perhaps 1 million. That may still be a problem since at the time of writing, I have over 43,000 Vines saved with more than 1 million loops. At an average of 2MB per video, that's equivalent to **86 gigabytes** - *and I'm not even done scraping yet*.

This is definitely a bridge to cross much later on.

### FAQ

- **Q**: Will I be able to find all my old Vines?
  - **A**: Unless you were famous, most likely **no**.
- **Q**: I can't find my favourite Vine using the search! Where is it?
  - **A**: If it isn't in my database, then it won't show up. It also has to fit the requirements for the search function (description or tags). It may also just be your search query.
- **Q**: The info (loops, likes, etc) loads but not the video. Why?
  - **A**: Sometimes this happens, and it's just that the Vine servers will not let anyone access that file. Unfortunately there isn't a way to fix this.
- **Q**: Why is your site so slow??
  - **A**: Because I'm a broke university student who has the cheapest server and database possible from [DigitalOcean](https://digitalocean.com). Nothing against them, I just can't afford better servers. But [donating](https://paypal.me/jmoore235) will help pay for what I do have, which will keep the project alive.

### To-do

*This is more for my reference*

- [x] ~~Proper JavaScript history~~ currently broken
- [ ] ~~Pages~~ cancelled
- [ ] JavaScript history V2
- [ ] Error handling
- [x] Tagging
- [x] Searching
- UI
  - [ ] About
  - [ ] Legal
  - [ ] DMCA
  - [ ] Improved header
  - [ ] Improved video/user/search pages
- Front-end JS
  - [ ] Split into multiple files
  - [ ] Modularize
  - [ ] `c o m m e n t s`