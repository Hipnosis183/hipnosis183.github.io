---
layout: post
language: "en"
code: "the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game"
title: The Fool and his Money - Making a keygen for a commercial Shockwave game
description: Wise men make proverbs, but fools repeat them.
thumb: /assets/images/posts/the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game/thumb.jpg
position: top
readtime: 11
wordcount: 2203
---

# A small note
Before starting, I'd like to say that this is meant to be a short article, as [my next big project](https://www.youtube.com/watch?v=dKa7DvTEwqI) is going to take a while to be completed, so to not kill the pace with the posts and shorten the gap, here's a quick one. I already talked about keygens on a [previous occasion](/blog/the-art-of-cracks-and-keygens-nicolausi/), so this is going to be more straight to the point, although with a slight twist, which I believe makes this one stand on its own.

<br>

# Introduction
Do you remember Adobe/Macromedia **Shockwave**? While I was more of a **Flash** enthusiast myself, Shockwave had its good share of games back in the late 90's and early 00's, being for some time the biggest platform for developing online video games. And while it was a very *feature-rich* technology, it would see itself behind the competition, its own relatives, as time went on.

Even if Shockwave and Adobe **Director** were constantly evolving and adding features, they would become obsolete by two other Adobe products: Flash, catching up and surpassing on features, dominating the online web gaming realm, and Adobe AIR, doing the same but for desktop applications. Shockwave ended up sitting in between these two, without excelling at neither.

Despite this however, some games developed in Shockwave would still be released during the 2010's, until its official death in 2017, which brings us to today's topic.

<br>

# A tale of errands and philosophy
**The Fool's Errand** is a puzzle game released for the original black and white Macintosh in 1987. I'm not much into puzzle games myself (nor the Macintosh), but apparently it's a highly regarded game by the Mac community, as it's a very *peculiar* kind of game, even to this day.

The game would receive a sequel in 2012, **The Fool and his Money**, after several delays going as far back as 2003, so suffice to say it was a very anticipated title, at least for the more hardcore fanbase.

The series creator, **Cliff Johnson**, who's also a filmmaker (and a *very* philosophical dude), decided to self-release the game, available to purchase exclusively on his website via email. If you have read my [Nicolausi article](/blog/the-art-of-cracks-and-keygens-nicolausi/), you would know that this is a *terrible idea* in the long run, and eventually leads to the game being unnecessarily complicated to buy or straight up abandoned. Guess what happened?

Cliff has been contacted recently by someone who wanted to buy a license key for the now unobtainable game (it's not uploaded on the internet), and his response was, *and I quote*:

<br>

![](/assets/images/posts/the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game/00.png){: .center-image }

{: .center-text }
What a philosophical way to describe laziness.

<br>

I was not fucking around when I said he was a ***very*** philosophical guy, a bit too much for my taste. But the question is, **why?** Is the game not compatible on modern systems anymore? Would it be very costly to update and put it on modern storefronts like GOG or Steam? What is it? I'll try to answer these questions at the end.

But first, let's take a look at the **licensing system**, as explained by the game website's [installation guide](https://www.fools-errand.com/06-FM/guide-installation.htm):

<br>

1. Download the game.
2. Get the `PassWord` and `PassKey.zip` from the **confirmation email**.
3. Put `PassKey.zip` inside the game folder and *unyield* the file `PassKey.txt`.
4. Open the game and enter the `PassWord`.
5. Enjoy the game.

<br>

The pertinent decompiled code will also be available on [GitHub](https://gist.github.com/Hipnosis183/40630dcc5337a24f0586130907d36487) so you can follow along.

<br>

# Organizing what we have
All we know for now is that we have an Adobe Director/Shockwave game in hands. But how do we approach it? So far, if you have read my previous articles you'll know, I've only dealt with native Windows programs and Android apps, but this is neither, so it's time to sit down and do some research.

Everything I know is that Shockwave games come in `DCR` (**published movie**) or `DIR` (**editable movie**) format, but the game has an executable instead, *a big one*. So first we have to unpack it, for which I'll use [director-files-extract](https://github.com/n0samu/director-files-extract), a Python script to extract all the contents bundled within the executable. This generates several `CST` files (**editable casts**) and the `DCR` project file:

<br>

![](/assets/images/posts/the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game/01.png){: .center-image }

{: .center-text }
I don't know exactly why `zzz-COPY-Game-HERE`, but who am I to judge.

<br>

But if we try to open the files all we'll see is **garbled text**, as these are **published files**, which behave similarly to compiled programs, so these need to be decompiled before being able to read their content. For this, I'll use [ProjectorRays](https://github.com/ProjectorRays/ProjectorRays), a Director/Shockwave decompiler, in all the previously extracted files. But what do we do with these?

<br>

# Just like the old days
Now that the files are readable, I thought about looking at the decompiled code and see what the password system is all about, but it isn't that simple just yet: you need Adobe Director to open the project files. The game was developed with Director `11.0.3` (2008), and I found a copy of version `11.5` (2009) on [archive.org](https://archive.org/details/adobe_director_11.5), so I went with that one and thankfully everything seems to run just fine.

<br>

![](/assets/images/posts/the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game/02.png){: .center-image }

{: .center-text }
Hey kids, grandpa came to visit.

<br>

Upon opening Director, we can enter a registration code or continue with a **90-day trial**; I believe that's going to be **more than enough** time for our purposes. After opening the Director project, we are granted with the main interface:

<br>

![](/assets/images/posts/the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game/03.png){: .center-image }

{: .center-text }
Stripped down UI with the stuff we need.

<br>

Since we are not going to develop a game, all we care about is the **casts panel** at the right, which will hold all the scenes and related code, and the **play controls** at the bottom of the main panel (or in the toolbar at the top), to run the game and test the code we modify.

Looking through the **cast files**, the password related code is found on cast `103`, **member** `08-StartUp`, so let's get there and see what's going on.

<br>

# The PassKey system
As stated before, the game reads a `PassKey.txt` file and the `PassWord` that came with it included in the purchase email. It's an educated guess that the text file includes this password in one way or another to check the input password's validity.

Looking into the **[Lingo](https://en.wikipedia.org/wiki/Lingo_(programming_language))** code, we can see the first mention of the `PassKey.txt` file inside the `special_Frame_2()` function:

<br>

![](/assets/images/posts/the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game/04.png){: .center-image }

<br>

This code checks the validity of the `PassKey.txt` file, as well as the presence of `PassKey.zip` to tell the user that they forgot to unpack it. First it checks for the **file size** (`1000 bytes`), then it runs the contents starting from the **4th byte** through the function `decodeZip()`, which is going to be recurrent throughout the entire password checking process, as well as other operations we'll discuss later. After the decoding process, we can see the actual name and password format **in plain**: ***pipe***, ***password***, ***pipe***, ***name***, ***pipe*** (or `|ABC123XYZ|Hipnosis|`).

Now with this knowledge, is time to look into the **encoding**/**decoding** functions:

<br>

<div id="code-0" class="collapsible-hide">Press to show the code</div>

<div id="code-0-data" class="content-hide" markdown="1">
{% highlight js %}
// Define 'zip-code' and 'zip-mark' cast member data.
const zipCode = [37, 28, 52, 88, 65, 20, 92, 49, 67, 11, 5, 44, 2, 29, 3, 93, 60, 22, 69, 56, 3581, 83, 68, 24, 13, 31, 80, 26, 8, 85, 19, 94, 77, 90, 41, 66, 79, 58, 30, 17, 73, 34, 15, 75, 2791, 43, 50, 48, 25, 53, 23, 72, 55, 42, 82, 51, 39, 4, 32, 46, 36, 74, 33, 70, 1, 84, 59, 14, 3864, 7, 71, 16, 40, 57, 61, 10, 86, 63, 45, 78, 76, 47, 87, 54, 62, 89, 21, 12, 9, 6, 18];
const ZM = '*&^%$#@!?=({[/|\\]})+<>:;,.”’';

const encodeZip = (S) => {
  // Get character at random.
  let ct = Math.floor(Math.random() * ZM.length);
  // Store character for later decoding.
  let SS = ZM[ct];
  // Loop through all input characters.
  for (let x = 0; x < S.length; x++) {
    // Get current character keycode.
    let N = S[x].charCodeAt();
    // Check if the current is a valid ASCII printable character.
    if (N >= 32 && N <= 126) { ct++;
      if (ct >= 94) { ct = 0; }
      N = S[x].charCodeAt() + zipCode[ct];
      if (N > 126) { N -= 94; }
      SS += String.fromCharCode(N);
    } // Invalid character, leave it as is.
    else { SS += S[x]; }
  } // Return final encoded string.
  return SS;
}
{% endhighlight %}
</div>

{: .center-text }
Lingo to JavaScript translation of the encoding function.

<br>

These functions utilize two **encoded constants**, `zip-mark` (`ZM`) and `zip-code` (`zipCode`), so to easily get them I just added a `put()` function into the code, which is the *Lingo way* of printing into the console, outputting the results into a **Messages** window inside Director. For the scripting reference, Adobe has a [dictionary](https://help.adobe.com/archive/en_US/director/UsingScripting/director_reference.pdf) available online, very handy since we are dealing with a **dead** programming language.

For the encoding process, a **random character** from the `ZM` string is selected as a **starting point** and added to the **output string** (to know how to decode it later on). This means that the same input text can have several different outputs. Then, it loops through all characters to check if all of them are **valid printable ASCII characters** (key codes `32-126`), and finally processes each with the values inside the `zipCode` array, taking another value as the index, `ct`, which resets after a certain amount of loops. Decoding is the same, but the other way around.

Porting these functions to another language (**JavaScript** in this case) is fairly straight forward, the only big difference being the *indexing* which starts at `1`, and some functions that behave differently. It's also very easy to test the code, as we can use the *original Lingo functions* to see the expected output. Now with everything done, we can start looking into making a keygen.

<br>

# Fooling the fool
Even if with the encoding and decoding functions we are almost done already, we still need to build the `PassKey.txt` file. With our **name** and **password** of choice with the format described previously, all that's left are the **first** `3 bytes` and the remaining data to pad the `1000 bytes` required to be valid. It turns out it doesn't matter what's in there, so I'll just put spaces instead. So yeah, *that's it*. It took me more time to make the thumbnail image of the article than the keygen.

You can access to the encoder, decoder and keygen on [GitHub](https://gist.github.com/Hipnosis183/40630dcc5337a24f0586130907d36487) together with the cast decompilation, or online from the extras section [here](/extras/fool-and-his-money/).

<br>

# You gotta believe
We are not done yet, as there's a *little detail* we overlooked. Back over the game's website, in the installation instructions there are two sections: **current orders** and **true believer pre-orders**. The only difference is that the latter doesn't come with a `PassKey.txt` file, only the `PassWord`. So this means that there has to be a way to enter the game with just a password, and while the answer is yes, it's a bit sneaky to notice at first glance.

The function `special_Frame_3()` controls the state of the password input scene, making sure that the data entered is correct and that it matches the information inside `PassKey.txt`. The phase `5` is mainly in charge of this, and at the beginning of it a function is called, `special_FindPassWordName()`, which inside loops through the variable `theDataTotal`, which is assigned back over `special_Frame_2()` at the very end from the **cast member** `miscellaneous`, which is a big encoded string found on cast `101`. By adding some `put()` functions, we can confirm that these are the names and passwords we are looking for. But attempting to decode it *as-is* won't work, as it's not a single encoded string, but *several different concatenated*, including an index besides the data itself. This means that to be able to see what's inside, we have to **reimplement** the `special_ReadDataChunk()` function, which is called right after the assignment:

<br>

<div id="code-1" class="collapsible-hide">Press to show the code</div>

<div id="code-1-data" class="content-hide" markdown="1">
{% highlight js %}
const special_ReadDataChunk = (miscellaneous) => {
  const len = miscellaneous.length;
  let N = decodeZip(miscellaneous.slice(0, 13));
  const totalLong = parseInt(N);
  N = decodeZip(miscellaneous.slice(13, 26));
  const totalName = parseInt(N);
  const theDataChunk = miscellaneous.slice(26, miscellaneous.length);
  let chunkLong = decodeZip(theDataChunk.slice(0, totalLong));
  let chunkName = theDataChunk.slice(totalLong, theDataChunk.length);
  let pos = chunkLong.indexOf('|') + 1;
  N = chunkLong.slice(0, pos - 1);
  const theDataTotal = parseInt(N);
  chunkLong = chunkLong.slice(pos, chunkLong.length);
  let arrayLong = [];
  for (let x = 0; x < theDataTotal; x++) {
    pos = chunkLong.indexOf('|') + 1;
    N = chunkLong.slice(0, pos - 1);
    arrayLong[x] = parseInt(N);
    chunkLong = chunkLong.slice(pos, chunkLong.length);
  } let theDataName = [], theDataTrue = [];
  for (let x = 0; x < theDataTotal; x++) {
    theDataName[x] = decodeZip(chunkName.slice(0, arrayLong[x]));
    chunkName = chunkName.slice(arrayLong[x], chunkName.length);
    theDataTrue[x] = decodeZip(chunkName.slice(0, 10));
    chunkName = chunkName.slice(10, chunkName.length);
  }
}
{% endhighlight %}
</div>

<br>

Not much to explain here, other than it's manually parsing the index to then read the data into some arrays, which then are going to be used inside `special_FindPassWordName()` to see if the input password matches any of these *true fools* who made a pre-order back in 2003.

Before moving on, there's one more little thing I'd like to mention. Going back to `special_Frame_3()`, phase `12`, one last check takes place; it compares the user name with the string `*^DR$_GMlsLT~ydL*`, or `Jonathan Raven` on its decoded form, which matches one of the names on the true believers list. **Only for this specific name**, a flag named `AUTO-SOLVE` is enabled, and while this does execute some slightly different code, nothing changes in-game, and I don't care enough to research it further. Just thought it was weird that such a specific check was in there, and makes me wonder if there's more to it or if it's just for testing something.

Either way, both this function plus the fully decoded true believers list are also available on [GitHub](https://gist.github.com/Hipnosis183/40630dcc5337a24f0586130907d36487).

<br>

# Who's the fool now?
It's cool to see another old game available and fully playable, even if in this case it's *not my cup of tea* (well, *neither was Nicolausi*). But now that we've seen that everything works just fine, and that it's very easy to circumvent the `PassKey` system, with or without source code, it's time to try to answer the questions from the beginning.

I came up with **three possible scenarios**: lack of interest, laziness or Cliff doesn't like money. I believe it's a mix of all of them, but whatever the reasons are, *it doesn't matter*, as now you can generate your own keys. It's a shame, as I believe a game like this would do very well in modern day, especially on places like **GOG**, *they would eat the shit out of it*.

On the technical side of things, there's not much going on, but it's been interesting to work not only with a deprecated technology such as Shockwave, but to have **fully readable code** available *for once*. At first I never expected to make an article about it, I just wanted to crack the game *the cheap way*, but it turned out to be not as quick as I thought, and eventually became more than just that. Plus the reasons at the very top, I said why not.

Also, I find particularly interesting the fact that the tools I used to extract the code are *fairly recent*, meaning that this wouldn't have been possible some years back. So I would like to thank the people behind the unpacker and decompiler, *good shit* (I should probably also thank the **NSA** for **Ghidra** someday).

So with that, I'll go back to my cave to work on **more important stuff**.
