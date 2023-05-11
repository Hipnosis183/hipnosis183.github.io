---
layout: post
language: "en"
code: "reversing-and-cracking-the-chinese-android-based-laptop-arcade-games"
title: Reversing and cracking the Chinese, Android-based, Laptop Arcade games
description: China is cool man.
thumb: /assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/thumb.jpg
readtime: 13
wordcount: 3004
---

# Some backstory with Android RE
While I've been doing reverse engineering of mostly *x86-based* software for the past year or so, my very first touch (pun intended) was with **Android** apps, around late 2018 (at the time I only knew computational logic and some basic Python). What motivated me was the rise in popularity of games requiring server connection to check licensing, a protection method that was made popular around that time, if not earlier.

The idea is simple, if you bought the game the legit way, when the app started you would connect to a proprietary server managed by the developer/publishing company to check that everything is in order (but it's also possible that Google offered a service for this as well, although I'm just speculating). If the check passed you can play the game, otherwise, an error message that takes you back to the home screen will show up. For the average user that would be fine, but I'm *not* the average user, I'm a *pirate*, and as a good *pirate*, I like to have my `APKs` in storage ready to go.

But in a serious note, there are even more important concerns about this than just playing without paying: **preservation**. With this kind of protection, you're tied not only to an internet connection requirement (although nowadays this is not really a problem anymore), but most importantly, to the company's willingness on keeping *that* server alive and accessible. Once they pull the plug, the game is gone for good.

There's also the fact that these games don't really need to be online to work (some might not even have any online functionality at all). We are not talking about **MMOs** or games of the like, but normal games that just happen to have these kind of extra protection layers. And sadly, these protections, while not on purpose, but by their design, are fated to doom the games we know and love.

Because of this (and the pirating thing from above, not gonna lie), I made my very first **license bypass** without knowing shit about anything, and it felt *awesome*. The guinea pig was **Monster Hunter Stories**, and this check in particular would be easy to avoid, since the game never stopped, but there was a system message on top that wouldn't allow you to interact with the game, and would close the application upon touch. With the patch, the check is still in place, but you never get the error message. *Fancy, isn't it?*

After this, I would continue with **Capcom** games, namely the whole **Ace Attorney** series, which shared a similar protection. Besides cracking, I would also develop **unlockers**, which would unpack extra data upon installation, unlocking *in-app purchases* (IAP) without the need of external tools and *third-party* apps such as **Lucky Patcher**. Also, one time I used these skills but not to pirate, but instead to *un-pirate*, removing start screens or messages left by hackers, since there were some games that didn't have clean `APKs` available on the internet (mostly games from the Android `1-4` era).

In the end, after some months of learning the technics and tools, dealing with Android apps burned me out, since cracking and documenting so many games was a very overwhelming task, and I wanted to move on to do other things. It would take 2-3 years to get back to it, due to an unexpected, irresistible, and Chinese little device.

<br>

# A weird and casual set of events
Around the end of November of 2021, it was brought to my attention that some people found an *Android-based* video games device for sale online which nobody seemed to know anything about, the **Laptop Arcade Player**, which included an impressive set of games *quality-wise* made exclusively for this particular machine (but yes, it also comes bundled with **[MAME](https://www.mamedev.org/)** and other games of questionable quality). Impressive considering the scope of these devices, which usually are a **SoC** (system on a chip) with a bunch of emulated or cheaply made games bundled with it. But some particular titles, such as **Rupture Void** and **Fighting Master Ultimate** are the highlights, since they have a considerable amount of effort put into them, just to be released in this particular portable arcade gaming machine.

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/00.png){: .center-image }

{: .center-text }
The Laptop Arcade Player with its specifications.

<br>

I've seen that some people got around dumping the contents (`APKs`) of the games, but there was a caveat: there was some sort of **protection/registration** going on during the app execution, that avoided the game to go further than the initial developer's logo screen on anything other that the original device. And then I said: *'Hey, that's a job for me!'*. Eventually, I forgot to reach out at the time, but after a week I remembered and messaged **[GuileWinQuote](https://twitter.com/GuileWinQuote)**, one of the guys involved in this mystery, which kindly responded and within the hour we're ready to go.

This is an interesting, yet short tale, but I want to emphasize on the reversing of Android apps aspect. I've been wanting to talk about it for quite some time, and this opportunity is the perfect excuse to do it.

<br>

# Analyzing the problem
Now with the files in hand, I can start testing them out. Installing one of the apps, the following screen with a message appears:

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/01.png){: .center-image }

{: .center-text }
Transcription: **🍋 LEMON ON**. Register is not installed, please try again after installation.

<br>

This is the *'killer screen'*, after this shows up the app closes. Right now, we can see two important things: first, it's a system message and **not game logic**, which makes our job much easier, and second, we have a string, which is going to save us a big chunk of time trying to find what we're looking for. This is the situation for all games, so it's fair to think that all use the same protection, and the solution for one will potentially work for others as well.

One more thing to point out before starting. I just care about making the games functional outside of the original device, and the approach I'll be taking here it's going to do just that. There won't be any analysis of how the registration process works internally or even how the apps interact with the custom system of the original machine. Here, we just want to circumvent this *'protection'*. With that being said, let's unfold this `APK`.

<br>

# Decompiling the application
**Update 2023:** Some of the information below is not exactly accurate, and the tools described are certainly not the best. Since the writing of this post I've learned a lot more about Android development and Unity reverse engineering, so I feel like these mistakes should be addressed. I don't want to modify what I originally wrote, so I'll quickly make some sort of *errata* here (*skip if you don't care*):

- Apps are not necessarily written entiretly in **Java**, but instead it can be used to interface between the native app code and the system functions. So in this case, the games are programmed in **Unity**, which includes methods to interface with the Java code, which manages all the registration checks against other system processes.
- I strongly discourage the use of **APK-Multi-Tool** and any similar tools. I personally moved over using **Apktool** directly, as well as manually handling keys and signing. It's not as complicated as I made it seem in the article. This is not the place, but I might talk about this in more detail in the future.

<br>

For those unaware, let's quickly go to some fundamental concepts. You program your app in **Java** code, which then gets compiled into **[JVM](https://en.wikipedia.org/wiki/Java_virtual_machine)** (Java Virtual Machine) bytecode and then into **[Dalvik](https://en.wikipedia.org/wiki/Dalvik_(software))** bytecode, which is the final form of the code bundled within the `APK`. **[Bytecode](https://en.wikipedia.org/wiki/Bytecode)** is a set of instructions readable by an interpreter, in this case the **Dalvik VM**, which can be seen as an interface between the Android system and the application process. Despite being an interpreter, Dalvik was pretty fast, including a **JIT** (just-in-time) compiler. I say *'was'*, because it was replaced by the more performant **[ART](https://source.android.com/docs/core/runtime)** (Android Runtime) on Android `5`, although both use the same structure (Dalvik Executable), and it's transparent for the applications and developers. But the Dalvik bytecode is not human readable, and there's when **Smali** comes to play. The Smali format allows us to read through the Dalvik bytecode in an easy and understandable way, being like a mix of Java and Assembly code. This Smali format is what we're going to use, for both modifications and `APK` recompilation.

If you've ever dealt with Android RE or decompilation before, you would know that there are many ways to approach this. But sticking to the way I did the things back then, I'm going to use **[APK-Multi-Tool](https://github.com/APK-Multi-Tool/APK-Multi-Tool)**, a suite of RE tools in a single package. This script allows you to manage everything you need, in our case **decompilation**, **compilation** and `APK` **signing**, and we use it particularly for the latter, since I don't want to deal with keys and stuff. The core of this script is **[Apktool](https://github.com/iBotPeaches/Apktool)**, which manages the decompilation/compilation and smaling/backsmaling. Besides this script, there are also other tools, such as the **[JEB Decompiler](https://www.pnfsoftware.com/)**, which decompiles the code straight into Java classes (and apparently allows you to recompile into the `APK`), which I won't be using here since I don't have experience with it, and I'm already used to work with Smali/Dalvik bytecode (although I'll be reading some decompiled Java code as well). *You gotta stick to your guns*.

One thing to note though, is that the version of Apktool bundled with APK-Multi-Tool is outdated as fuck, last update being made in 2016. After dealing with some errors, I figured I just needed to update Apktool manually, and I suspect it's because the older version didn't support some features introduced in newer versions of the **SDK Platform API** (the apps we're dealing with are targeted to API level `28`, Android `9`, 2018).

Now into the decompilation itself, after executing the **AMT** script we're granted with this beautiful user interface:

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/02.png){: .center-image }

{: .center-text }
'What the heck! Make a decision and do it. We don't make mistakes, we have happy accidents'.

<br>

Scary, isn't it? But don't let that options hell fool you, since for our needs we'll use only `4` of them. But first of all, we need to put our `APKs` in the very descriptively named `place-apk-here-for-modding` folder inside the AMT directory. Once that's in place, we need to select the current working project with the option `27`. Then comes the decompilation, with the option `9`. This will create the project with all the decompiled files inside the folder `projects`:

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/03.png){: .center-image }

{: .center-text }
Normally, we'd only be using the `smali` folder, but in some of these games we need to modify the `AndroidManifest.xml` file, because of some Apktool compatibility problems during compilation.

<br>

# Inspecting and cracking the code
Now with the `APK` decompiled, we can analyze the Smali code under the `smali` folder. Inside there's code for the game app and other external libraries/dependencies, so in this case we only want to explore the first.

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/04.png){: .center-image }

{: .center-text }
Application code folder structure.

<br>

As far as I was able to see, all games use the **Unity** game engine, so we can disregard the `unity3d` folder from the analysis. Besides that, the `registerlib` folder and `Verify.smali` file sound very *suspicious* (who would've thought), so they're definitively places to look at.

But let's begin by searching the string we encounter at the beginning, the error message. There's a match in the file `RegisterHelper.smali`:

<br>

<div id="code-0" class="collapsible-hide">Press to show the code</div>

<div id="code-0-data" class="content-hide" markdown="1">
{% highlight cl %}
.line 324
:cond_2
const/4 v2, 0x2 
if-ne p1, v2, :cond_3
 
.line 325
const-string v1, "Register is not installed, please try again after installation." 
goto :goto_0
{% endhighlight %}
</div>

<br>

This piece of code is within the function `errorHandle()`, for, well, error handling. There are four different error levels, but this one, code `0x2`, is the one that we are looking for. Searching for calls to this function gives us some results inside the same file, notably the functions `launchOnlineAppRegisterFlow()` and `launchRegisterFlow()`, which, if their names are not lying, they seem to **initialize** the whole **registration process**.

<br>

<div id="code-1" class="collapsible-hide">Press to show the code</div>

<div id="code-1-data" class="content-hide" markdown="1">
{% highlight cl %}
.line 145
:cond_0
const/4 v2, 0x2

invoke-direct {p0, v2}, Lcom/sencatech/registerlib/RegisterHelper;->errorHandle(I)V
goto :goto_0
{% endhighlight %}
</div>

<br>

We can see that this block of code, at the very end of both functions and as a result of a failed condition comparison above, shoots the `errorHandle()` function with `v2` as a parameter, a register with the value of `0x2`, our error code.

At this point we're just playing around and trying different things, so I'm gonna remove this function call or *'invoke'*, which should disable the error message and the `exit()` function. To recompile our modified code into an `APK` once again, we need to select the option `12` in AMT, and then sign it with option `4`. The final `APK` will be placed in the folder `place-apk-here-for-signing` with the name `signed{name}.apk`. Okay, so let's see what happens:

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/05.png){: .center-image }

{: .center-text }
'Hacking Genius of Chinese Software'.

<br>

Well, there it is, mission accomplished. *Or is it?*

<br>

# Taking it a step further
While the games now boot and play perfectly fine, there's one more thing we can do. So far, the registration process takes place, but we just disable the error handling, that is the message and the application exit. But why stop there, when we can **disable** the whole **registration process** altogether?

Looking back at the code again, we had the functions `launchOnlineAppRegisterFlow()` and `launchRegisterFlow()` inside the `RegisterHelper` class, which included the invokes for the `errorHandle()`, so let's see where they're used/initialized. Searching for the first one gives no results, so it's left unused. But the latter is used in two instances, one in the previously suspicious `Verify.smali` and the other in `Senca_ServiceConnect.smali`, and both share the same code:

<br>

<div id="code-2" class="collapsible-hide">Press to show the code</div>

<div id="code-2-data" class="content-hide" markdown="1">
{% highlight cl %}
.line 14
new-instance v0, Lcom/sencatech/registerlib/RegisterHelper;
 
invoke-direct {v0, p0, p1}, Lcom/sencatech/registerlib/RegisterHelper;-><init>(Landroid/content/Context;Ljava/lang/String;)V

invoke-virtual {v0}, Lcom/sencatech/registerlib/RegisterHelper;->launchRegisterFlow()V
{% endhighlight %}
</div>

<br>

Which can be translated into Java as:

<br>

<div id="code-3" class="collapsible-hide">Press to show the code</div>

<div id="code-3-data" class="content-hide" markdown="1">
{% highlight java %}
new RegisterHelper(context).launchRegisterFlow();
{% endhighlight %}
</div>

<br>

This piece of code is effectively creating a new instance of the `RegisterHelper` class, not only initializing it, but also executing the `launchRegisterFlow()` function. So if we now remove these class initializations, while getting the same results as before, now we should avoid completely the registration process, instead of just letting it fail.

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/06.png){: .center-image }

{: .center-text }
It works exactly the same.

<br>

Is this really necessary? No at all, but perhaps it's more correct, and in the end I decided to take this approach for the final cracks.

On a last note, this is just a way of doing things, as there are different approaches and solutions to the same problem. It happens in programming, and reversing inherits these properties as well.

<br>

# Some conclusions
After re-experiencing the reversing of Android apps, I can see why 3 years ago, with barely any programming experience, I managed to modify and crack stuff. The modification and recompilation process is a joke compared with **Windows PC** programs, more than just at the technical level. I must say though, the extra knowledge *really* speeds things up (i.e., **MHS** took me around 2 days, while all of this was done in like 20 minutes, and both are essentially the same).

The fact that Android apps run bytecode on a virtual machine makes it so much easier to understand what's going on, specially with Dalvik/Smali, which are very *high-level* (compared to Assembly and even recompiled code in some cases), and inherits a lot of **Java** and **OOP** properties, like classes and objects.

All in all, it is fun and interesting in its own way, but so far I can't say necessarily challenging, at least not in this kind of reversing, which is cracking protections. The end results though, as always, are very satisfying to see in action.

<br>

# A quick look into the games
So now that we have these, uh..., *unique* (for the lack of a better word) set of games cracked, and now are playable in our favorite emulator of choice, it would be a shame not to cover them, at least the more important. And remember, these games were developed **exclusively** for this device.

Beginning with the highlights, and the reason people got interested in this machine in first place, is the fighting game **Rupture Void** and its related, beat 'em up counterpart, **Fury Fight**. While the latter is a rather generic, but good enough beat 'em up, the amusing part begins with the first game. While all the characters, graphics and story are completely original on both games, all the music and sound effects are *ripped-off* from other fighting games. Just by hearing the first 2 seconds I already noticed 3 different SFX *rip-offs*. But most importantly, while having decent gameplay, the AI is *really* fucked up. If it got you in the air you're basically dead.

The other fighting game, **Fighting Master Ultimate**, shines by its jankiness, looking hilariously bad, but impressive at the same time, ripping-off everything from the **Street Fighter** series, including artwork, movesets, animations and audio. Something special to behold.

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/07.png){: .center-image }

{: .center-text }
`H A C K E R`

<br>

Finally, perhaps the most civilized game of the bunch is **Steam Gear**, a tank shooter in the ways of **Metal Slug**. While nothing outstanding, it has nice visuals and plays okay, with completely original content.

Before leaving this section, I want to give a spotlight to perhaps the most interesting game to me (and the one pictured above in the article), **Conspiracy Genius of Three Kingdoms**, for being an Android port of an **iOS** only game ([AppStore](https://apps.apple.com/us/app/id1487807886)), developed (and translated into English) exclusively, just for this particular device.

<br>

# The Chinese Android-based consoles quest may continue
While we stood victorious against the **Laptop Arcade Player**, there's an entire army (*I swear* I haven't played **3 Kingdoms** yet) of *Android-powered* console *rip-offs* like this out there. Not of this level of software quality for the most part, but you never know when another machine with such unique catalog of games may appear. If that happens in the future, I'm down to help to the cause.

Big shoutouts to the people in the **FGC** that discovered this interesting device, and a special thanks to **[GuileWinQuote](https://twitter.com/GuileWinQuote)** who wasted **$150 USD** on this piece of garbage and managed to dump the games, making this possible to begin with. Also, he made a cool video about it on [YouTube](https://www.youtube.com/watch?v=pFzAJj8eGPs), so go and check it out if you want to get deeper into the Laptop Arcade lore.

<br>

**中國萬歲！**
