---
layout: post
language: "en"
code: "recreating-a-server-for-a-dead-online-single-player-game-jewelry-master"
title: Recreating a server for a dead online single-player game - Jewelry Master
description: Let's save old and forgotten online games from obscurity.
thumb: /assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/thumb.jpg
---

# Introduction to online games
We've all played online games in our lives before, maybe even without really noticing it. Be it an *MMO*, a multiplayer mode, or just a game that requires server connection, since the late 90's they are present everywhere and in different forms, and with the inclusion of the mobile market on top of the already massive PC userbase, it just picked up more and more momentum through the years.

Online games bridged the gap between **video games** and **web technologies**, finding a better use for them other than visiting silly websites and sending emails. Online games also gives you an experience that otherwise wouldn't be possible, both for players and developers. But such great opportunities also come with an intrinsic cost: you **need** a connection to a server to be able to play. This is the major downside of online games, as its name implies, you must have an internet connection and at the same time, there has to be a server present on the other side. We can easily control the first one, but we have none of it for the second. This has become more of a problem in recent years, since this online server-client communication has also been deployed as a **DRM** solution against software piracy, but it also backfires as it makes the program in question completely reliant on this web server, rendering the software unusable without an internet connection (I already touched on the topic in my [previous article](/blog/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/), but I thought it was worth mentioning).

But as time goes on, we put all the laughs and fun aside and start looking at the bitter reality: ***nothing lasts forever***. The game that you loved and played for years and years of your life is gonna go at some point, and all that will remain are the memories and *the friends we made along the way*. But *hold on*, not all hope is lost, all it takes is a guy with the time, knowledge and will to fix this problem.

<br>

# Background
Something that I always wanted to do is to *revive old online games*, and since then I've wondered how easy or hard of a task it would be. When I started doing web development two years ago, I got to learn progressively how web technologies and network communications work, something confusing for me up to this point.

In my most recent project, **[Instagular](https://github.com/Hipnosis183/Instagular)** (**Instagram** client reimplementation), I had to figure out how to reimplement and interface some of Instagram's server-client communication functionality which required analyzing the requests between the two, including the user authentication management. This allowed me to cross-over web development and reverse engineering, and without even noticing it, gave me a taste of reversing and emulating a web server.

Fast-forward a couple of months and I decided to take a break from it to venture myself into another project similar in nature, but completely different at the same time. Something that I always wanted to do, but didn't have the capacity nor the experience to do, until now: *an online game web server emulator*.

<br>

# A diamond in the rough
Throughout the years, I've been keeping a list of online games that have already met their fate, and that would be potential candidates for when the right time comes. The one that was always on top of the list, and I knew it was going to be the first to go down, is **Jewelry Master**.

**Jewelry Master** was an online arcade puzzle game developed by **Arika** (of **Tetris Grand Master** and **Street Fighter EX** series fame) in 2006, and it was released as a testing project for a potential full-console version in the future, which did happen four years later with the release of **Jewelry Master Twinkle** in Xbox 360. The servers for the game were closed around 2011, rendering the game completely unplayable.

I guess by this point you already get why I chose this title over anything else. Not only this game has some similarities with a game that I love, **TGM3** (to the point where I made an [emulator](https://github.com/Hipnosis183/TTX-Monitor) and a [resolution patch](https://github.com/Hipnosis183/TGM3HD) for it), but also because it is **not** an online **multiplayer** game, but rather an online **single-player** game, let me explain.

Jewelry Master has only two main online functions: user authentication and rankings/leaderboards management. But even then, the game won't get past the login screen without a server running on the other side. This makes this title a *perfect* target for a first project like this, since I don't have to deal with multiple servers, multiplayer state management and other fun online multiplayer concepts. And as you will read later, this game doesn't have any sort of security/protection going on, so it's gonna be straight to the point.

It's also worth remembering that we are dealing with a game with no server available, so all we have to work with is the client program, which makes things unnecessarily more complicated than they should be. At the same time, I've never played this game before, so I've no idea how some things are supposed to work. For this project, we'll be looking at the reverse engineering process, and later on applying all the knowledge we gathered to create a software solution able to replicate the original server functionality as close as possible.

<br>

# Server communication
When opening the game we are prompted to the main menu, where we can log in with the user id and password we previously should’ve created on the *now defunct* account registration page. Regardless of the information we enter, the outcome is the same:

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/00.png){: .center-image }

{: .center-text }
Clearly the game server is dead, so there’s nothing to connect to.

<br>

Now that we know the current situation, let’s take a look at the server communication in **Wireshark**:

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/01.png){: .center-image }

{: .center-text }
Isolated the traffic generated by the game.

<br>

We can take some valuable information from here. We can see that the server domain is `hg.arika.co.jp`, and the DNS server can’t resolve an address for it. Because of this, we can’t go any further in the current state, so we need to find a way around it before continuing.

<br>

# Tricking the game
So now we have to trick the game to search for the server in another place. Thankfully, on Windows we have the *hosts file*, which allows us to **map a host name to a different IP address**; a perfect temporary solution without having to patch the program or hook networking functions. By adding a new entry, we can redirect the domain name to *any* server we want, in our case the *localhost*:

<br>

<div id="code-0" class="collapsible-hide">Press to show the code</div>

<div id="code-0-data" class="content-hide" markdown="1">
{% highlight conf %}
127.0.0.1 hg.arika.co.jp
{% endhighlight %}
</div>

<br>

With this little change, all the server calls under that domain will have the original server hostname replaced with localhost, while keeping the port number and the rest of the route intact. This now allows us to implement our own server as an *in-place* replacement, as long as we keep the structure of the original, so let’s get to it.

<br>

# Creating a server
For the development of the server reimplementation I’m going to use **Node.js**, since I work with it pretty much every day, but once everything is done, I'm also going to port the server code to **C** using some network library to make it more native and simple to run. Additionally, I’ll be using **Express.js** to make routing and other operations much easier to handle, so let’s start with a simple server:

<br>

<div id="code-1" class="collapsible-hide">Press to show the code</div>

<div id="code-1-data" class="content-hide" markdown="1">
{% highlight js %}
const express = require('express');
const app = express();
const port = 8081;

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.send();
});

app.listen();
{% endhighlight %}
</div>

{: .center-text }
It just returns an 'OK' response.

<br>

This should allow us to get past the DNS error and finally be able to see what the game is actually requesting. So now let’s monitor the packets again in Wireshark (using the **loopback traffic adapter** now; otherwise we won’t be able to capture from localhost) and see what the game does:

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/02.png){: .center-image }

{: .center-text }
Well, that was easy.

<br>

I guess that’s it. It turns out the game doesn’t give a shit about the server after all, and **it can work perfectly fine without any functionality implemented**. In this state, everything works except for the text message (the broken HTML part), the reading and writing of high-score rankings and the replays system, but at its core the game is otherwise fully playable. So even if we can play the game in the current state, now it’s time to start implementing the server functionality *piece by piece*.

<br>

# Reimplementing the server
If we take a look at the Wireshark dump we can see multiple requests to the server whose endpoints can't be found, all of them under the `/JM_test/service/` route:

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/03.png){: .center-image }

{: .center-text }
As we can see by the query string parameters, the game doesn’t encrypt any of its data, making our job far easier.

<br>

We can use this information (together with the strings in the executable) to know what *route endpoints* we need to implement in our custom server, and then look at how the client parses the expected data (or just start guessing) to finally figure out how everything works. It sounds good on paper, but let’s see what it actually takes.

<br>

<div id="code-2" class="collapsible-hide">Press to show the code</div>

<div id="code-2-data" class="content-hide" markdown="1">
{% highlight slim %}
GET     /JM_test/service/GameEntry
GET     /JM_test/service/GetMessage
GET     /JM_test/service/GetName
GET     /JM_test/service/GetRanking
GET     /JM_test/service/GetReplay
POST    /JM_test/service/ScoreEntry
{% endhighlight %}
</div>

{: .center-text }
List of all the requests made by the program.

<br>

Let’s begin by getting out of the way the most straightforward of the bunch, `GetMessage`, by simply returning a string:

<br>

<div id="code-3" class="collapsible-hide">Press to show the code</div>

<div id="code-3-data" class="content-hide" markdown="1">
{% highlight js %}
app.get('/JM_test/service/GetMessage', (req, res) => {
  res.statusCode = 200;
  res.send('Hello World!');
});
{% endhighlight %}
</div>

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/04.png){: .center-image }

{: .center-text }
I feel utterly saddened for wasting this **perfect** opportunity to write a funny sentence instead of a simple `Hello World!`, but I’m a grown adult and must behave as such.

<br>

The one that gets called the most is `GameEntry`, which I assume is for **user authentication**, used for logging in, getting rankings and starting a game. Nowadays you would expect an encrypted token to be securely transferred to the server, but here we just have an `id` and `pass` query parameters. There’s also a `game` param, which always has the value of `0`, and a `ver` param, for making sure that the client is always up to date.

This is the point at which we have to start thinking about building a database for storing this user data (and later on, score rankings as well). For this I'm going to use **MongoDB** with **Mongoose** for object modeling (because I would prefer to die before using **SQL**), although any other database engine would do just fine. So assuming a user model with the fields `id`, `pass` and `rankings` (for personal scores), a complete implementation will look like this:

<br>

<div id="code-4" class="collapsible-hide">Press to show the code</div>

<div id="code-4-data" class="content-hide" markdown="1">
{% highlight js %}
app.get('/JM_test/service/GameEntry', (req, res) => {
  res.statusCode = 200;
  User.findOne({ id: req.query.id, pass: req.query.pass }, (e, user) => {
    // Check if user exists and the credentials are correct.
    if (user) { res.send(); }
    // Check for users with the same id and create a new one if allowed.
    else if (req.query.id.length > 0 && options.register) {
      User.findOne({ id: req.query.id }, (e, exists) => {
        if (!exists) {
          // Store new user into the database.
          const user = new User({ id: req.query.id, pass: req.query.pass, rankings: [] });
          user.save(); res.send();
        // An user with this id already exists.
        } else { res.send('1'); }
      });
    // Wrong user id or password.
    } else { res.send('1'); }
  });
});
{% endhighlight %}
</div>

<br>

This code doesn't perform any security measures, since that is outside the scope of this project. In a real online service (if someone wants to do that), this behaviour should probably be changed, or at least not store the passwords as plain text. Besides that, I added a `register` property in an options object, which allows users to be registered from the game client itself if the `id` doesn't match any results in the database (this may also be changed for a real online server). Also, you may notice the return of `1` as an error message if the login fails. After some research, I found that this is the response to trigger the *'wrong id or password'* message in the game client, in addition to the code `10` for server connection error and one more code that I couldn't find which will trigger the version mismatch error.

Next we have the `GetRanking` call, which is perhaps the last bit of reversing that we'll have to do for the rest of the project, since none of the remaining endpoints require data specially formatted as a response. The query parameters here are `id` (user id, which can be optional), `mode` (difficulty), which can be `0` (normal), `1` (hard) or `2` (death), and a `view` param, to determine between user or global rankings. Before continuing, let's see how rankings are structured and classified, and what the game response is so far.

The rankings are classified into two major groups: **personal rankings** and **global rankings**, and each is sub-classified depending on the difficulty, giving a total of **6** ranking lists. The main difference between the two is that the personal rankings can store up to 10 score entries for each mode without replays saving, whereas the global rankings can hold an undefined amount of scores with replay storage but only one per user. Rankings, both personal and global, consist of the following fields: `id` (user id, owner of the entry), `mode`, `score`, `jewel`, `level`, `class` (I *assume* it's for the player title) and `time` (there's also a `date` field in-game, but apparently never got implemented). These fields are also sent by the client for the `ScoreEntry` call, so we can create a schema model from them.

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/05.png){: .center-image }

{: .center-text }
It seems like the game is trying to parse the 'not found' HTML page that Express.js sends back automatically.

<br>

This took me a couple of hours to figure out, but here's a breakdown of how the rankings formatting and parsing work: each ranking object is a 10-lines long string, and in a group they're delimited by a dot (.) character. The first two lines correspond to the rankings **table index** and **ranking id**, and next are (in order) the `id` (user), `score`, an **unused value**, `level`, `class`, `time`, `jewel` and finally a **highlight flag**. The first two values are only useful for the global rankings, since the first one is used to set the initial position of the user highscore when loading the global rankings (and to get the `My Record` index), and the second is an identifier value (given by the server) to retrieve the replay file with `GetReplay`. The `class` value (again, assuming is the score title) can be `101`, `102`, `201`, `202`, `301`, `302` and `303`, and the highlight flag makes the score's color yellow, although I don't know under what conditions a score should be flagged with it (once again, I'll assume its intended use is to mark the user's highest score in a table).

The funny part is that each ranking object has to be *exactly* 10 lines long, one more or one less and the client will crash. It just so happens that the Express.js default response is also 10 lines long, therefore working perfectly fine as a valid ranking object. This was the key to understand why the program was crashing on me whenever I changed the response, and eventually helped me to figure out the format. The complete implementation:

<br>

<div id="code-5" class="collapsible-hide">Press to show the code</div>

<div id="code-5-data" class="content-hide" markdown="1">
{% highlight js %}
app.get('/JM_test/service/GetRanking', (req, res) => {
  res.statusCode = 200;
  // Manage personal rankings.
  if (req.query.id && req.query.view == '0') {
    User.findOne({ id: req.query.id }, (e, u) => {
      let ranks = [];
      // Sort rankings in descending order.
      let rankings = u.rankings.sort((a, b) => b.score - a.score);
      for (let r of rankings) {
        // Build response string.
        let lit = (r == 0) ? 1 : 0;
        let rank = `0\n0\n${r.id}\n${r.score}\n0\n${r.level}\n0\n${r.time}\n${r.jewel}\n${lit}`;
        // Add rankings for the selected mode.
        if (req.query.mode == r.mode) { ranks.push(rank); }
      }
      // Return concatenated strings.
      res.send(ranks.join('.'));
    });
  // Manage global rankings.
  } else {
    // Sort rankings in descending order.
    Ranking.find({ mode: req.query.mode }).sort({ score: -1 }).exec((e, r) => {
      if (r.length > 0) {
        let ranks = [], f = -1;
        // Set rankings table index.
        let index = req.query.view == '-1' ? 0 : req.query.view;
        if (req.query.id) {
          // Get user score position table index.
          f = r.findIndex((v) => v.id == req.query.id);
          if (f != -1) { index = Math.floor(f / 10); }
        }
        // Fill the 10-slots scores table.
        for (let i = (index * 10); i < (index * 10 + 10); i++) {
          if (!r[i]) { break; }
          // Build response string.
          let lit = (i == f) ? 1 : 0;
          ranks.push(`${index}\n${r[i]._id}\n${r[i].id}\n${r[i].score}\n0\n${r[i].level}\n${r[i].class}\n${r[i].time}\n${r[i].jewel}\n${lit}`);
        } res.send(ranks.join('.'));
      } else { res.send(); }
    });
  }
});
{% endhighlight %}
</div>

<br>

But to be able to **see** the rankings, we need to be able to **store** them in first place. So now it's time to add an endpoint for the `ScoreEntry` call, which unlike the rest, is the only `POST` request of the bunch. Despite this though, all the score data is still transferred through query parameters, since the actual body is used to send the **replay data**. I'm not gonna get into the code of this one since it's pretty lengthy and just stores the received data, but it's worth mentioning that the server handles the rankings and replays accordingly, updating and replacing entries whenever necessary. I also implemented a `multiscores` option, to allow multiple scores per-user on the global rankings, allowing multiple replays to be stored as well. The data is sent as an `application/octet-stream` object wrapped around a `multipart/form-data` request. While Express.js has a *built-in* function to send data as an attachment (download), it cannot receive/store (upload) these types of requests, for which I'll use the middleware **Multer** to get that job done.

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/06.png){: .center-image }

{: .center-text }
Pretty good scores for just a test session, if I say so myself.

<br>

And now that we have the replays stored on the server, we can retrieve them on the client's demand. Implementing `GetReplay` is as simple as it gets (remember that we control the replay id value, sent with `GetRanking`):

<br>

<div id="code-6" class="collapsible-hide">Press to show the code</div>

<div id="code-6-data" class="content-hide" markdown="1">
{% highlight js %}
app.get('/JM_test/service/GetReplay', (req, res) => {
  res.download(path.resolve() + '/rep/' + req.query.id + '.rep');
});
{% endhighlight %}
</div>

{: .center-text }
The replays are stored under the `rep` folder with the `.rep` extension.

<br>

Finally, last and absolutely least the `GetName` call, which I couldn't find a use for. It's just sittin' there.

<br>

# Porting the server
With the Node.js server up and running with all features implemented, now it's time to go to the *dark side*, a place that I don't even wish to my worst enemy, making a web server in ***The C Programming Language™***. For this masochist task, I'll be helping myself with **Mongoose Web Server** (not to be confused with the previous Mongoose for database modeling), a C library designed for creating small servers on embedded devices, and **LMDB** a very *light-weight* and performant *key-value* database engine (in contrast to the *document-based* Mongo). Other libraries that I'll be using include **[mjson](https://github.com/cesanta/mjson)** (by the developers of Mongoose) to parse the database objects and the JSON requests from the client, and **[ini](https://github.com/rxi/ini)** (great name my dude) for parsing the configuration file for the server. I'm not going to explain in detail the C implementation (unless you want to hear me rant about stupid memory allocation errors and how shit is to work with *objects* and *strings*, sorry, ***structs*** and ***null-terminated char arrays*** in C) as it's basically the same conceptually as we've already seen with Node.js, and the code is like 4 times bigger, so there's that. You can go and check it out on [GitHub](https://github.com/Hipnosis183/JM-Server) if you want.

I will however, talk about the *new addition* to this version, namely the **DLL injection** and **hook of networking functions**. So far we've been editing the Windows hosts file to redirect all the client calls to our local server, but wouldn't it be neat not to have to?. Besides, it would be great to have the server starting and running in the background while the game executes and to stop it automatically when the game closes, so it's basically going to be the whole package, as transparent as possible. At the same time we want some flexibility, so we can still use this hook to connect to other servers, both C and Node.js ones, either locally or over the internet, so let's get to it.

<br>

# Injecting the hooks
Out of the *gazillion ways* there are to inject DLLs and hook system functions, I'll be using an injection method that I had from a previous project, and the *well-known* **MinHook** as the hooking library. So let's find out what we need to hook by opening **Ghidra** and looking at the imports on the game executable:

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/07.png){: .center-image }

<br>

Out of all the libraries, the one that we're looking for is **WinINet** (`wininet.dll`), which is a system networking API that handles all the communication operations through HTTP or FTP. Since all we want to do here is to redirect the server calls, the only functions we need to hook are `InternetOpenUrlA` for all the `GET` requests, and `InternetConnectA` which is necessary for `ScoreEntry` to open the connection before requesting the URL. To implement the hooks, we initialize MinHook in `DllMain` and point to the detouring functions, which will modify the hostname to point to the address we give to it, and finally returning the execution flow to the original function call with the modified parameter.

<br>

<div id="code-7" class="collapsible-hide">Press to show the code</div>

<div id="code-7-data" class="content-hide" markdown="1">
{% highlight cpp %}
// Define pointers to the original functions.
typedef int (WINAPI *INTERNETCONNECTA)(HINTERNET, LPCSTR, INTERNET_PORT, LPCSTR, LPCSTR, DWORD, DWORD, DWORD_PTR);
INTERNETCONNECTA fpInternetConnectA = NULL;
typedef int (WINAPI *INTERNETOPENURLA)(HINTERNET, LPCSTR, LPCSTR, DWORD, DWORD, DWORD_PTR);
INTERNETOPENURLA fpInternetOpenUrlA = NULL;

// Define functions to overwrite the originals.
int WINAPI dInternetConnectA(HINTERNET hInternet, LPCSTR lpszServerName, INTERNET_PORT nServerPort, LPCSTR lpszUserName, LPCSTR lpszPassword, DWORD dwService, DWORD dwFlags, DWORD_PTR dwContext) {
  // Change the original host with the configured IP address.
  return fpInternetConnectA(hInternet, (LPCSTR)HOSTNAME, nServerPort, lpszUserName, lpszPassword, dwService, dwFlags, dwContext);
}
int WINAPI dInternetOpenUrlA(HINTERNET hInternet, LPCSTR lpszUrl, LPCSTR lpszHeaders, DWORD dwHeadersLength, DWORD dwFlags, DWORD_PTR dwContext) {
  // Change the original host with the configured IP address.
  char buf[200]; int ofs = 21; snprintf(buf, 200, "http://%s%s", HOSTNAME, lpszUrl + ofs);
  return fpInternetOpenUrlA(hInternet, buf, lpszHeaders, dwHeadersLength, dwFlags, dwContext);
}

BOOL WINAPI DllMain(HMODULE hModule, DWORD fdwReason, LPVOID lpReserved) {
  switch (fdwReason) {
    case DLL_PROCESS_ATTACH:
      // Initialize MinHook.
      MH_Initialize();
      // Hook InternetConnect() and InternetOpenUrl() to redirect server calls to localhost.
      MH_CreateHookApiEx(L"wininet", "InternetConnectA", &dInternetConnectA, (LPVOID *)&fpInternetConnectA, NULL);
      MH_CreateHookApiEx(L"wininet", "InternetOpenUrlA", &dInternetOpenUrlA, (LPVOID *)&fpInternetOpenUrlA, NULL);
      MH_EnableHook(&InternetConnectA);
      MH_EnableHook(&InternetOpenUrlA); break;
    case DLL_THREAD_ATTACH: break;
    case DLL_THREAD_DETACH: break;
    case DLL_PROCESS_DETACH:
      // Disable hooks and close MinHook.
      MH_DisableHook(&InternetConnectA);
      MH_DisableHook(&InternetOpenUrlA);
      MH_Uninitialize(); break;
  } return TRUE;
}
{% endhighlight %}
</div>

{: .center-text }
Notice the `HOSTNAME` global variable, which will store the server address that's in the `server.ini` configuration file. Not showing the options parsing for brevity.

<br>

To close this segment, I'd like to mention that I also wanted to hook the `Direct3D 9` library and add an option to force the window mode to fullscreen, but I encountered several problems. It turns out that, as you could see from the imports, there's no `d3d9.dll` to be seen. That's because the program delegates all the game functionality (video, audio, inputs, data unpacking, etc.) to the library `Skeleton.dll`, which gets loaded with `LoadLibraryA` after the initial program execution. Due to the way MinHook works (and any other hooking library), it needs the DLL to be already loaded in memory to get its address and make the hook. That wouldn't be an issue if we just created a hook for `LoadLibraryA` and after the call we create a new hook inside of it with the DLL already loaded, right?. While it should work that way (I mean, I guess), MinHook returns an initialization error when trying to enable the hook, despite being able to create it perfectly fine. I assume it's a MinHook specific error, but at this point I'm too lazy (and short of time) to report the problem or make a change of library, and none of the alternatives I found were as simple to use and minimal in size. I guess it will be for another time.

<br>

# Server configuration and program usage
Now that both the server and library hooking are done, let's quickly talk about how they'll work from the user perspective. As I mentioned previously, I wanted flexibility in how to use the program, being able to play locally, connect to an online server, or host your own. To achieve this, I designed **server modes** which, depending on the one selected, will change the way the program behaves:

<br>

- Mode `0` is for **local single-player**, running the server in the background while executing the game client.
- Mode `1` is for **online play**, disabling the server and database initialization and connecting to the address specified in the configuration file.
- Modes `2` and `3` are to host a server under the address specified in the configuration file. One opens the game client, the other a console with server information.

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/08.png){: .center-image }

{: .center-text }
A server running in online mode (`1`) connected to a server in host mode (`2`) in a **LAN** connection.

<br>

I also added an option to disable the DLL hooking, since it may trigger anti-viruses (this will require adding the hosts file entry manually). Besides the connection configuration, there are also the previously mentioned user options: **register**, **multiscores** and a **no scores** option, because why not. Apart from this, just put the files in the game folder and you're good to go. Speaking of which, since the game client can't be downloaded officially anymore, I took the liberty to upload it to [archive.org](https://archive.org/details/jewelry-master). This client is version `1.32`, the only one saved by the **Wayback Machine**, but the last known version is `1.40`. If I ever get a hold on that one I'll update the archive, and if not much changed, the server should work for it as well, considering that we don't have any *hard-coded* patches.

<br>

# Server error: disconnecting...
This one, *as per usual*, has been an interesting experience overall. I finally got to work on a server emulator and discover if all the ideas and speculations I had throughout the years were true (*they were*). I acknowledge that this particular case was a very simple example, and not very representative for server emulators in general (usually *far* more complex), but even then it was enough to answer my questions and in the end being able to fulfill my goal of **bringing a dead game back to life**. And besides, the feeling of knowing that you are (probably) the first person to play a game in over a decade is just priceless, although in this case in particular I already know that I'm not (another guy [already attempted](https://tetrisconcept.net/threads/jewelry-master-clone-for-pc.3230/#post-64740) this some years ago, but he never figured out the rankings system format).

I'm also very surprised by the amount of things that *just worked* by pure guesswork and trying things, like the initial server creation and the rankings format, more than ever before. I first thought that it would take more than a week just to reverse the client and understand how it worked to some extent, but in reality it only took around 3-4 days including the full development of the Node.js server. In fact, I spent most of my time fighting with the C implementation, for almost 2 weeks. I guess it's understandable considering that before this project I never really made a program in C from scratch (not even a *Hello World*), purely by myself. It was one day to figure out how to build a server, another to understand memory allocation, pointers, compiling, you get the point (pun *absolutely* intended).

In the end I'm very happy with the results, and I hope this serves as a foundation for future projects of the like, since this is definitely just the beginning.