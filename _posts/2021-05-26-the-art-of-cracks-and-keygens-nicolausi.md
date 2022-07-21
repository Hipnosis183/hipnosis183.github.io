---
layout: post
language: "en"
code: "the-art-of-cracks-and-keygens-nicolausi"
title: The art of cracks and keygens – Nicolausi
description: Have you ever wondered how these things worked? Well, finding it out can be very fascinating.
thumb: /assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/thumb.jpg
---

# Introduction, and a short tale about piracy
During the entirety of my childhood I’ve been solely a PC user, no video game consoles whatsoever. The fact that in my country video games weren’t very widespread nor cheap in those days, *freeware* games and *piracy* were the way to go. In fact, I consider it a cultural problem that has always existed and kind of remains until this very day, but thankfully modern digital stores/platforms like Steam with their regional pricing helped to highly reduce this issue and mindset. But the takeaway is, piracy was normalized, and (in the PC world) **cracks** and **keygens** were common and normal to see. If there was any commercial game out there for download (online) or sale (at least over here), it surely was a pirated copy and distributed with one of these.

I was always amazed by keygens: open the game, copy this code here, generate, go back to the game, paste and profit, you now have a fully unlocked game. Not so much for cracks, since those were there but you never really noticed them. I still remember the *'installation process'*, managed by my father, which always included a crack or a serial/keygen. Nostalgic times, for sure. However, this was always the key point: I thought it was normal, and didn’t realize the harm that piracy involved. That’s what I meant by *'cultural problem'*. Not trying to justify it, but that’s the way it was.

During the early days of my adulthood, I kept the piracy culture and practices, but this time on my own. This led me to be more and more interested in those topics, and all the technicality behind it. It wasn’t only about the games anymore, but rather the whole security bypassing, breaking the programs in ways they were never meant to be broken, *that was exciting*. But at that time I was barely capable of understanding anything about it, let alone having the knowledge and skills necessary, besides being completely lost in where to start to learn.

Eventually, that day came (well, not literally, it was a process), and since then I’ve been playing around with various sorts of protections. Once you get into it, you realize how challenging and fun it can be, and I’m going to show one interesting case in this lecture, a game that I don't give a shit about, and yet here I am: **Nicolausi** by **TOM Productions**, for **DOS** and **Windows**.

<br>

# The game
Nicolausi is a german *'action'* game, where you help *Santa Claus* (or *Nikolaus* in this case, which I suppose the game takes its name from) to collect and deliver presents to the correct house on each level. Of course, you are being chased by none other than the *Easter Bunny* itself, who equipped with his *'Ghettoblaster'* and the power of *techno music*, will try to destroy you and ruin Christmas, so you better avoid him.

The game is basically an isometric maze game, kind of frustrating and boring as well, since it’s more about brute forcing your way through rather than thinking your moves carefully. Short on content as well, with only 3 levels available in the **shareware** version. But that won’t be a problem anymore, since we’re going to unlock the full 10 levels of the **registered** version.

<br>

# But why
I don’t know, it just happened. I guess it was the fact that this game didn’t have a crack or a registered version available on the internet, so I had to do something (that wasn’t paying $14 bucks for a crappy 20+ years old game). Besides, as you’ll read in a moment, there’s some interesting stuff going on with this title.

<br>

# Disclaimer
Before starting, I have to make clear that this article is just for **entertainment and educational purposes** only, and it’s **not to encourage piracy**. That’s because **the game is still being sold** by the developer (yep, right on their [website](https://www.tom-productions.de/) like in the old days). As such, while there will be research, code and algorithms exposed, no registration codes will be displayed, nor the final keygen produced will be *publicly* available. That said, let’s get started with this thing.

<br>

# Choosing between DOS and Windows
So, we have ourselves a DOS game to crack, which means **DOSBox Debugger**. I’ve used it before, and while it’s not as comfortable and easy to use as Windows programs of the same kind, it gets the job done, and it’s definitely better than any native DOS debugger. However, I’ve only used it to debug the **DOS API**, like *CD checks* and such, but wasn’t very successful with in-game logic, so I try to avoid using it whenever I can. Thankfully, this is one of those lucky cases, since there’s also a Windows version of Nicolausi.

The Windows version, developed *'due to the high demands'*, is a **DirectDraw** port of the DOS version, being referenced as an *'emulator'* (maybe it is, but I doubt they developed a fucking DOS emulator instead of just porting the damn game, or even easier, shipping it with **DOSBox**). There’s also an **Ad-lib emulator** (the **Sound-Engine**), because why not, and to preserve that *beautiful techno music* that plays whenever the *Easter Bunny* is near you. Finally, this version also uses the original DOS data files.

Now, the initial plan is quite simple: crack the Windows version, and then see if we can use some of that to patch the DOS executable as well. Even if the game runs or not on top of an emulator, the game logic *should be* similar. So, before starting with the analysis, let’s see the differences between the two versions:

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/00.png){: .center-image }

{: .center-text }
On the left the DOS version, and on the right the Windows version. As far as I can tell, the only change is the increase in resolution.

<br>

# The registration check
Whenever you get past the third level, the game will pop-up a registration screen, where you enter a name and a code:

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/01.png){: .center-image }

{: .center-text }
Despite the website saying the contrary, the Windows version is only available in German. Name entry on the left, code entry on the right.

<br>

Let’s load this bad boy on **Ghidra**. At this early point I’m just searching around for strings, and suddenly found something that caught my attention:

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/02.png){: .center-image }

{: .center-text }
**CHECKID** and **WRONGID** seem suspicious. There’s also **PASSWORD** and **LICENSE**, but the first is related to the level password system, and the latter with the reading/writing of the license file.

<br>

This specific block looks rather interesting, and those conditions may lead to something related to the code checks we are looking for, so we’ll keep an eye on it. Now let’s switch to **x64dbg**, and start analyzing this memory address to see the code in action:

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/03.png){: .center-image }

{: .center-text }
Hey, that’s me!

<br>

I entered my name when the game asked, and now we can see that it appears in this region of memory. If we relate this value on address `0x44A388` with the **C decompilation** on Ghidra, now we know that the first check is the name entry, to ensure that it’s not `NULL`. Also, the name has to be at least two separated words, otherwise the game won’t allow you to continue.

Next, there’s the function at address `0x4133C0`, which takes the name string as argument. Will look in more detail on this later, since we can assume that this function handles the *key generation algorithm* based on the name string. The function returns and stores the key in a variable, which is in the next comparison.

When checking the value of the memory address `0x44A294` in my previous test, it had a value of `0`. That’s the key number that appears by default, and I had not changed it, so let’s try a random number and then check again:

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/04.png){: .center-image }

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/05.png){: .center-image }

{: .center-text }
If we transform `0x138D5` from hex to decimal, we get our 'random' number, `80085`.

<br>

With this, we can confirm that memory address `0x44A294` stores the input code value, which means that in the second comparison the game is indeed comparing the key we input and the correct, expected key generated by the algorithm. Now it’s time to pat ourselves on the back, we’ve found what we’re looking for. About the rest of the block, we don’t care, it’s just more checks for error handling, setting `CHECKID` if the key is `0`, or `WRONGID` if the key introduced is incorrect/invalid.

Lastly, as an interesting yet useless fact, checks for this code runs each time certain events occur, even in-game, like loading menus, levels and pressing keys, and I don’t care to find out why.

So now it’s just a matter of changing those *jump instructions* and we’re good to go:

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/06.png){: .center-image }

{: .center-text }
The fifth level, because I refuse to play this thing anymore.

<br>

# Beautiful, but what about DOS?
There’s a problem, however, that I guess was expected from the beginning. The code of both versions is different, and thus the patch for the Windows version *is not applicable* on the DOS executable, so we need a different approach.

The solution is actually very simple, and it’s even better than a specific patch. Remember when I said that the function at address `0x4133C0` handles the key generation algorithm? Well, there you have it, enjoy your key. Now that we’ve a name, and the game was kind enough to calculate a key for us, we can go through the registration process the normal way. This *name+key* combination works in both versions of the game, so they are interchangeable.

There are two ways of doing this, by entering the registration information normally, or by copying the files `G_NIC1.SCR` and `LICENSE.TOM`.

<br>

# Boooooring
Yeah, this game is boring, but we can still have some fun with it.

So far we have made a crack for one version, and generated our own keys for both, albeit in a nonconventional way, so we’ve to fix that.

After all, this is actually the main point of this whole post, to reverse the key generation algorithm and implement it in a *high-level* language, so keys can be generated by the press of a button instead of searching in memory at execution time. What makes it more exciting is that **I’ve never done something like this**, not at this *low-level*, and I’ve *zero* algorithm theory and experience, so bear with me and wish me luck.

<br>

# Analyzing the algorithm
Now it’s time to dissect the function located at `0x4133C0`, which I’ll name as the *keygen function*. As we can see in the first picture with the decompiled code, the function takes **two arguments**, the first one is a pointer to the name string, and the second, after some research, is a `32-bit` **salt**, which I’ll name as the **main salt**. I don’t care where it comes from, since it always has the same, consistent value of `0x3533335`, and that’s enough to work on the hashing.

The keygen function starts with setting a `16-bit` **local-scoped salt**, which is generated from the main salt by `XOR`ing the higher bits with the lower bits. This salt inherits the consistency, with the value of `0x3066`. Setting this is important, since it’s going to be the salt’s **reset point**, more on this in a moment. After that, based on the local, a **global salt** is set, the one that’s actually going to be used through the **hashing**. Finally, a return variable (for the generated key) is initialized.

Next, the *string parsing* begins, taking the first character from the pointer. I won’t go into much detail here since well, it’s just a parser, but basically: it checks for each character (in **ASCII**); if it’s a space, number or symbol, it just increases the pointer to the next character, and if it’s a letter, it sets the *uppercase* value of it into an array. This array will store the current **working string**, delimited by the invalid characters. If the input string is `Renzo123 Pigliacampo456` for example, the output working arrays would be `RENZO` and `PIGLIACAMPO`, ignoring completely the spaces and numbers. Those strings will later be processed in separated iterations of the hashing.

Since we’re talking about it, here’s a *fun fact* about the name entry in-game. Despite that there are no checks to control an overflow of the array size limit of `80` bytes, the game has you covered, since if you fully fill the input box (`35` characters) on the Windows version, it will crash. And if you're wondering, no, it doesn't crash on DOS, but the block of text in the window gets shifted some pixels to the right each time you retry. Seems like somebody forgot to test their input boxes.

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/07.png){: .center-image }

{: .center-text }
I couldn’t read it in german anyways.

<br>

After building a working character array, the parsing of the name string is halted and the hashing begins. The local salt is reset (to `0x3066`), just in case it’s a *consequent iteration*, and then it starts the processing of each character. A **new salting function** is called, which multiplies the global salt value by a new salt, `0x15A4E35`, plus `0x01`. This function stores the `32-bit` result back to the global salt, but only returns the higher bits of it. This signed `16-bit` value will then be `XOR`ed with the actual character being processed, summing the result into the final key variable. This process is repeated for the remaining characters, and once finished it continues with the parsing of the remaining name string. When everything is done, the lower bits of the key variable are `OR`ed with `0x2000`, and then the value returns.

So that’s it, I hope it wasn’t very confusing to follow. If you want, you can help yourself with the *revised decompilation* on [GitHub](https://github.com/Hipnosis183/NicolausiKey), which contains a stripped version of the functions.

<br>

# Let’s make a keygen
Now that we know the logic behind the key generation, we can replicate its functionality using the *programming tools* of our preference. For this, I was going to choose **JavaScript**, since I’ve been doing web development for the past couple of months, but I realized that maybe the *good ol’ reliable* **C#** would be more fitting for the task, since a simple console application is all we need for now. If in the future I end up releasing the keygen, a `Windows Form` with *flashing visuals* and *chiptune music* will be a must, no excuses.

The program will follow the structure described before, and while I’ll keep some of the fundamental operations intact, like bitwise operations, everything that could will be implemented on a higher level, so for example, we don’t need to write our own string parser. As such, I’ll only showcase those *high-level* cases.

First, we initialize and configure all the *salting*:

<br>

<div id="code-0" class="collapsible-hide">Press to show the code</div>

<div id="code-0-data" class="content-hide" markdown="1">
{% highlight cs %}
// Despite being calculated, their values are consistent.
const uint mainSalt = 0x03533335;
const uint localSalt = mainSalt >> 0x10 ^ mainSalt & 0xFFFF; // 0x3066

// Set global salt.
SetGlobalSalt(localSalt);

static void SetGlobalSalt(uint localSalt) {
    // Set a 16-bit mask of the local salt.
    globalSalt = localSalt & 0xFFFF;
}
{% endhighlight %}
</div>

<br>

Then the *parsing*:

<br>

<div id="code-1" class="collapsible-hide">Press to show the code</div>

<div id="code-1-data" class="content-hide" markdown="1">
{% highlight cs %}
// Parse the input string.
while (nameInput.Length != 0) {
    // Uppercase chars and remove spaces and numbers.
    NameFormat();
}

static void NameFormat() {
    foreach (char letter in nameInput) {
        // Remove char from input string.
        nameInput = nameInput.Remove(0, 1);

        // Check if char is a space or number.
        if (letter != 0x20 && !Char.IsNumber(letter))
            // Add to the parsed string.
            nameParsed += (Char.ToUpper(letter));
        else break;
    }
}
{% endhighlight %}
</div>

<br>

Once we have a *working string*, it’s time to process it:

<br>

<div id="code-2" class="collapsible-hide">Press to show the code</div>

<div id="code-2-data" class="content-hide" markdown="1">
{% highlight cs %}
// Set the first 4 bytes of the working string, needed for the hashing.
byte[] nameGlobal = Encoding.ASCII.GetBytes(nameParsed.PadRight(4, 0x00));
uint nameGlobal32 = BitConverter.ToUInt32(nameGlobal, 0);
nameGlobal32 = nameGlobal32 & 0xFFFF0000;

while (nameParsed.Length != 0) {
    // Set the lower 2 bytes of the working string, starting with the current character.
    byte[] nameLocal = Encoding.ASCII.GetBytes(nameParsed.PadRight(2, 0x00));
    uint nameLocal16 = BitConverter.ToUInt16(nameLocal, 0);

    // Actual hashing.
    charSalt = ReturnGlobalSalt();
    charSalt = charSalt ^ (nameGlobal32 ^ nameLocal16);

    // Sum the result to the key.
    keyCode += (int)charSalt;

    // Remove char from parsed string.
    nameParsed = nameParsed.Remove(0, 1);
}
{% endhighlight %}
</div>

<br>

Since we have a *high-level* processing approach, it is necessary to **simulate** some of the *low-level* behaviours, in this case some memory management.

The game first stores the working string array produced in a contiguous `80` bytes block, from which only the first `4` bytes are read into the register that will be used to store the character processing (the variable `nameGlobal32` here). For example, given the working string `RENZO`, only `RENZ` will be loaded.

But after the first character is processed, only the lower bytes are `AND`ed with `0x0000`, then replaced with the first `2` bytes of the string starting in the next pointed character (`nameLocal16`). That means that the higher bytes are always constant during the hashing of that working string. So in the second iteration of the example above, the actual value (generated by `nameGlobal32 ^ nameLocal16`) would be `ENNZ`, which then will be hashed with the salt, then next `NZNZ`, `ZONZ`, `O0NZ` and finally `00NZ`. Because after the final character there’s nothing, is necessary to always pad `nameLocal16`, and in the case of our implementation, specify the padding character of `0x00`, since if not, the `PadRight` function will add a space (`0x20`) instead, and we *certainly* don’t want that.

<br>

Finally, when everything is done, we return the key:

<br>

<div id="code-3" class="collapsible-hide">Press to show the code</div>

<div id="code-3-data" class="content-hide" markdown="1">
{% highlight cs %}
// Return lower bytes of the final key code result.
return (uint)keyCode & 0xFFFF | 0x2000;
{% endhighlight %}
</div>

<br>

Then just call the function from *main*:

<br>

<div id="code-4" class="collapsible-hide">Press to show the code</div>

<div id="code-4-data" class="content-hide" markdown="1">
{% highlight cs %}
static void Main() {
    // Name input.
    Console.Write("Enter name: ");
    string nameConsole = Console.ReadLine();
    
    // Key generation.
    uint keygenResult = KeyGenerate(nameConsole);
    Console.WriteLine("Your key is: " + keygenResult);
    Console.ReadKey();
}
{% endhighlight %}
</div>

<br>

And that’s it, we got a working keygen. In this implementation I covered all the possible input cases that the game would *normally* allow, except the handling of *special characters*, for which an expanded or *lower-level* implementation may be required to process them properly. But for now, I’m happy with it.

<br>

# But wait, there’s more
The developers, **TOM Productions**, have a couple more games out there, and one specifically uses the same engine as Nicolausi, **PC-Bakterien**, also for DOS and Windows. Out of curiosity, I decided to take a look at that game as well, and it turns out that my initial theory was correct: the keygen also works with PC-Bakterien. Well, not *as-is*, since this game has a different salt (`0x784326`), but after fixing that, *it works like a charm*.

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/08.png){: .center-image }

{: .center-text }
**PC-Bakterien** has **20** levels instead of **Nicolausi**’s **10**. Behold level 20. Of course I’m not a masochist to play all the levels, but rather exploited the save file. Said exploit consisted of `0x00`ing `80` bytes, and it even gave me very high scores. This works on Nicolausi as well (`40` bytes instead). And as a fun side note, **yes**, PC-Bakterien has the exact same crashing and text box sizing issues as Nicolausi.

<br>

I haven’t tried with the rest of the games, and I think that I had enough already. However, only the **Robot** *series collection* made its way to Windows, so that would be the only other game that I could actually analyze and try to get the salt, in case it has the same keygen logic. But anyways, I would call this project a *success*.

<br>

# Closing up
This whole thing took me roughly like 3-4 days, a **lot** less than I anticipated. It was definitely a lot more fun than playing the game itself. But most importantly, **I realized my dream of making a keygen** (no fancy graphics and music, *I know*), and hopefully it will be the first of many more.

Now on a *serious note*, despite me shitting on the game during the entire writing, it’s actually not *that* bad, and if you like this kind of game you can find some joy out of it. However, this joy from 1995 it’s definitely **not** worth $14 in 2021, and on top of that, having to buy it straight from the developer’s website is a big no today. If you’re part of TOM Productions and are reading this (hi Andreas), put your stuff on **Steam** or **GOG** at an accessible price, at least you’ll have a lot more visibility there, and might *actually sell* something. As I said at the very beginning, the only reliable way for me and a bunch of people to buy games is through Steam and their regional prices, and if the game would’ve been there, I’d have bought it without a doubt.

And lastly, as promised there will be no final keygen or crack publicly available, though you could *easily* develop one with the explanation and code showcased above. Also, there’s the *revised decompilation* on GitHub, which is uploaded to give the interested a guide to follow the explanation, and to have fun with it, *I guess*. But if you choose to do it, *please* keep it for yourself and don’t share it over the internet, have some respect for the developers, which surprisingly are still supporting a game for a dead platform.

That said, whenever the developers stop supporting and/or selling the game and I notice it, the full keygen for both Nicolausi and PC-Bakterien will be available on [GitHub](https://github.com/Hipnosis183/NicolausiKey) for everyone. Until then, I hope you had a good time reading.

<br>

**Update 24/12/21:** ***Spoiler alert***, they stopped selling the game. What a christmas gift!

<br>

# Hipnosis 4:20 - Those who wait shall be rewarded by time
So as expected, TOM Productions finally pulled the plug to their proprietary store of evil, making all their games *officially* **unavailable to buy**. And as promised (once that happened), the keygen is now available to download. Head over the project page on [GitHub](https://github.com/Hipnosis183/NicolausiKey) to grab the keygen in one of two flavors: **C#** (WinForms and Console) or **JavaScript**. I decided to add the latter, since I plan to create page on the site in the future so it can be used without having to download anything.

<br>

**Update 28/02/22:** It's up and running, you cand find it on the extras section [here](/extras/tom-productions).

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/09.png){: .center-image }

{: .center-text }
The keygen itself. Notice the lack of flashy, over the top visuals. I know I promised it, but sadly don't have the time and will to add those. On the bright side, it looks like one of a kind keygen for sure.

<br>

So what's left for the future? I still like the idea of visiting their other games, namely the **Robot** series, which, in an amusing way, has a surprisingly strong cult following, including a dedicated [website](http://www.game-of-robot.de/) and forum, in which one person even [crafted a custom collector's box](https://forum.tom-productions.de/gameofrobot/robot-spiele/robot-allgemein/the-game-of-robot-collection-box/). Holy shit.

Until that day comes, you can enjoy (or suffer) with Nicolausi and PC-Bakterien.

<br>

***Merry Christmas!***
