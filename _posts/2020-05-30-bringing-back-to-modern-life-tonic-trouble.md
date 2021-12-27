---
layout: post
title: Bringing back to modern life – Tonic Trouble
description: Develop a solution to give new life to an old title in modern times.
thumb: /assets/images/posts/bringing-back-to-modern-life-tonic-trouble/thumb.jpg
---

# Introduction
Some old games tend to be a bit tricky to make work on modern systems, and ~~Rayman 2~~ **Tonic Trouble** is no exception. May it be because the game itself, or some of its dependencies, always something holds it back from working, and it’s job of the community and fans (or just people interested in it) to bring it back to the modern technological life.

<br>

# Background
This is the case for the often forgotten (and shadowed by its sister project, Rayman 2) Tonic Trouble. It’s worth mentioning that this game release was a mess, with two different versions, one completed (**Retail**), and an unfinished one (**Special Edition**). Because Ubisoft fucked up the release across Europe, we’ll be focusing just on the intended release, the Retail version, despite that, later on, the same treatment will be applied to the Special Edition as well, since a lot of people seem to like that one more.

At the same time, the Retail release had several versions released. It mostly has to do with the releases on different countries, each with a different one depending on the date it was released. I think that changes are unknown across versions, but most likely these were just bug fixes, nothing big. The plan here is to cover all the versions of the Retail release, but since we’ve to start somewhere, we’ll begin with the latest of the latest, the **Review English** version, released in Italy and Spain, *of course*. Later on it’ll make more sense and be part of the several re-releases all over Europe.

<br>

# The point of this
Before we begin, I should explain the objective here. There’s no science in using a wrapper and presto, the game is working (well not exactly, you’ll see why). But this is an attempt to ease and automatize the setup process, mostly for the average user that just want to play the game without any hassle. The goal is to make an *all-in-one* (AIO) program that deals with everything (a launcher, if you like), from those more straightforward things as the graphics wrapper and its configuration, as well as the more technical stuff, that will be the main focus of the article and deeply explained in the rest of the writing.

The rest will be very basic and simple x86 analysis and reverse engineering, but as a beginner, I think it could be interesting to some in the same situation, or those afraid who think it’s very complex. Once you understand the basics on how assembly works, and get familiar with the software needed, is very straightforward (but not always easy), and logical to work with. So if it seems like a stupid and pointless thing to explain, keep that in mind. With that said, let’s begin.

<br>

# Analyzing the situation and setting up a working environment
So, the Review English version is very particular. Unlike the others, this one, for whatever reason, had its executable packed. Fine, so we just unpack it, but of course there’s a catch. Trough normal analysis, we can easily tell the executable is packed, since from the `PE Header` to the `Sections Table` there’s garbled data:

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/00.png){: .center-image }

{: .center-text }
How it looks (left), and how a normal section should look (right)

<br>

Ok, so now that we know this, let’s try to unpack it:

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/01.png){: .center-image }

{: .center-text }
Fuck.

<br>

Fantastic, we don’t know with what it was compressed. You’ll say, *'okay, not big deal'*, but the thing is that whatever is used to unpack the file, it doesn’t work on anything past `Windows XP` (hence the *dependencies*), making the executable halt during the unpack process in modern computers, just like the one you’re using right now.

The only solution I could think at this point is the brute way, dumping the memory. After hours of debugging (keep in mind, I didn’t know anything about PE format structure, leave alone rebuilding one) on a real `Windows XP` machine (not VMs, since the game has requirements their virtualized GPUs don’t meet), I gave up. The data were there, but there were missing imports, rendering the executable unusable, and I’m not experienced enough to find and redirect that manually.

Thankfully, the community I mentioned at the beginning comes at rescue. In the **Rayman Pirate-Community** (by the way it’s a Rayman 2 pun, nothing to do with piracy), the user **RibShark** had already achieved it, sharing the unpacked executable. As I stated before, it was done by manual unpacking, so shout-outs to him for it.

Now with the unpacked executable, and the temporal help of a video wrapper, we’re ready to get the game functioning and begin to work.

<br>

# Enhancing the executable
With everything in a minimum working state, we can begin adding some nice features, from a more technical aspect rather than functional, since the game *as-is* already works, although in a *sketchy* way. First, the game needs some files to start, which are generated by the included setup program, which in turn also needs files created when the game is installed from CD.

We need to keep in mind that the game dates from 1999, and around that time a lot (a **LOT**) of software used the `Windows` folder to store most of its configuration and other data as well. This case is no exception, and the game stores its settings under `Windows/UbiSoft` (remember when they were stylized *LikeThat* ?). One of our tasks is to change that, and make it use the game root folder. This will make the game fully portable, and will remove the necessity of installing the game in first place. Also, some other trivial *quality-of-life* (QOL) enhancements will be made, like removing the log system and redirect some folders, rendering the necessity of the CD non-existent.

For the graphics department, a video wrapper will be included (the magnificent **dgVoodoo**), to max the resolution to desktop. Additionally, a widescreen patch will be available, which involves some nice math. All of this, implemented in a dynamic way, so no manual configuration should be involved, other than activating or deactivating the features.

It’s important to balance the technical design with how those features will be presented to the user. This is *key* in software design and development, since if we don’t approach the problem in the correct way, we’d had wasted a lot of time and work. Also, the goal is to build a program, not just patch a binary, so this point is important. Now, with an approximation of how everything will look and how features will work, we can begin with the neat stuff.

<br>

# Getting dirty
Okay, so this step will require some decompiling and debugging. The two aren’t really necessary together, but I like to see things from both perspectives. Still, I use a lot more static decompilation for code analyzing, and hex editors for actual testing. Pretty unconventional I know, but I’m more comfortable working that way for now, with simple stuff like this. Debugging is more to see what the program is doing, and how my changes behave. Also, *breakpoints are fun*.

For this, we’ll go full open software, with **Ghidra** for decompilation and **x64dbg** (**x32dbg** actually) for debugging. Extra software will include a hex editor (**HxD**) and the great **Process Monitor**, core for our success.

The first obvious thing to try is to see if we can modify the values of interest directly from the binary with a hex editor, mainly stored strings. So far, it’s just possible to change filenames, but not paths. This lets us change quite some things, like logs and other files, but not the game configuration path.

With that, we start right away with Ghidra, and analyze the executable. We’re trying to redirect the file operations with the `Windows` folder (in regards to the game settings, in this case under the path `UbiSoft/Ubi.ini`) to the current working directory of the program, so the first thing that comes to mind is to search for calls to the function `GetWindowsDirectoryA`, and find a way to replace it with `GetCurrentDirectoryA`. After a quick search, 4 calls are found, all with a similar structure (slight variations might be because of the compiler):

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/02.png){: .center-image }

<br>

We can see the `UbiSoft/Ubi.ini` string, also present in the binary. This easily means that we found what we were looking for, and repeats in the four calls, all at the beginning of their respective functions. Now it's time to see what to do.

At first, in an unsuccessful attempt, I tried to tweak it into `GetCurrentDirectoryA` call. By the logic of the function, it *should’ve* worked, but computers are smarter than me. The string ended up cut for some reason, checked in x32dbg and Process Monitor. After more stupid attempts, some interesting information worth knowing was brought to my attention.

Remember at the beginning when I mentioned **Rayman 2** as a *sister project* ? Turns out that Rayman 2 uses the base game engine as Tonic Trouble, with quiet some more polishing on top. The cool part is that it behaves *exactly* the same as Tonic Trouble, file management-wise, which means it also stores files under the `Windows` folder. This would mean nothing if Rayman 2 wasn’t a very popular game, but that’s not the case. In 2011, Ubisoft re-launched Rayman 2 in **GOG**, making some fixes along the way for its proper functioning in the systems at the time. One of those changes was the one we are treating right here, file redirection from the `Windows` folder to the game folder.

With this information, we do the exact same process with 2 new executables, the original, unpatched Rayman 2 executable, and the new, patched GOG executable. Since it’s patched, is very likely that we won’t found any matches for a `GetWindowsDirectoryA` search. Here’s when the original executable comes to play: we can search for the function over there, then search its address in the patched executable. When search for the function, something familiar can be seen:

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/03.png){: .center-image }

{: .center-text }
Can you spot the difference?

<br>

Jokes aside, is literally the same code. Now, when we search it in the patched executable, the function looks like this:

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/04.png){: .center-image }

{: .center-text }
Nice NOPs

<br>

So, turns out that leaving the string *empty* is the key. The game searches for the file in the working directory, so no need to use `GetCurrentDirectoryA`. Some values are adjusted so the registers and stack don’t fuck up and everything keeps the flow.

Okay, let’s try *something stupid*. Let’s copy (adjust) the address block with the `MOV` and `NOPs` instructions and replace the Tonic Trouble executable functions:

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/05.png){: .center-image }

{: .center-text }
Surprise!

<br>

It wasn’t a very stupid idea after all. As Process Monitor shows, the file is being correctly read from the game directory, and now everything is working as expected. Also, the same applies to the setup program, which shares the same code. Patching this file is also important.

This finishes this first part, and by this time we also have some other patches regarding the game itself resolved, so now we can move to the second cool feature to implement, the widescreen patch.

<br>

# Wide that beautiful view, said nobody
This feature is rather simple to implement, since it follows a common and well-known practice in video game hacking. To put it simple, the game outputs on the screen at a defined resolution, and determines the visual range in the boundaries of that screen resolution with a *field-of-view* (FOV) value. There’re a series of common hex values that can be found in the game binary, and by modifying those, we can change the game options.

In this case, we’re going to modify the resolution option, with the *integer* value of `800x600` (`640x480`, while ideal since is the default resolution of the game, crashes if its value is modified), and the FOV, with the *float* value of `1`. Remember that we’re always working on *hexadecimal*, so all those values should be converted respectively.

Before any modification, let me explain the process. First, we change the resolution values. This is to get a proper *vertical image* (`Ver-`) display, but in turn, the horizontal gets stretched (depending on the game, it will stretch the image or adjust it). That’s when the FOV comes in place. After treating the resolution with some math, we can get the proper FOV and *horizontal image* value (`Hor+`), for then get a correct aspect ratio and image display.

This process is very easy, we just find the offsets for those formatted values and modify them:

<br>

- `800` (int/2 bytes) (`0x320`, `20 03` formatted) @`0x11235`
- `600` (int/2 bytes) (`0x258`, `58 02` formatted) @`0x1123B`
- `1` (float/4 bytes) (`0x3F800000`, `00 00 80 3F` formatted) @`0xD0B50`

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/06.png){: .center-image }

<br>

Changing the resolution values is straightforward, but the FOV is quite more challenging:

<br>

<div id="code-0" class="collapsible-hide">Press to show the code</div>

<div id="code-0-data" class="content-hide" markdown="1">
{% highlight cs %}
double FovHorizontal = Math.Round((2 * Math.Atan(((double)ScreenWidth / ScreenHeight) / ((double)4 / 3) * Math.Tan((double)1 / 2 * (Math.PI / 180)))) * (180 / Math.PI) * Math.Pow(10, 2)) / Math.Pow(10, 2);

double FovVertical = Math.Round((2 * Math.Atan(Math.Tan((FovHorizontal * (Math.PI / 180)) / 2) * ((double)ScreenHeight / ScreenWidth))) * (180 / Math.PI) * Math.Pow(10, 2)) / Math.Pow(10, 2);
{% endhighlight %}
</div>

{: .center-text }
Implementation in C#

<br>

We first calculate the horizontal FOV, and with that, the vertical FOV. This gives us a decimal value, which then we convert to hex. To understand it more easily, take it as a *cross-multiplication*: if `1.33` (4/3) is `1` (FOV), then what FOV will `1.78` (16/9) have? Obviously this is oversimplified, and is not used because one formula may not work in all the possible cases.

It’s worth mentioning that some people use generic values, and while covering most scenarios, is not a precise thing to do, and might catch the game off-guard when an uncommon aspect ratio is presented. Also, we want to be the most dynamic we can get.

<br>

# Ready for some coding
So, now that we sorted out the file management and widescreen, we met all the initial goals. It’s time to start working on the program that will reflect all the research and improvements that have done until now.

The program will be a very simple `Windows Form` application, with a main and a settings window. I’ll be using `.NET Framework 3.5` to max the compatibility across systems, or make it run at least on an `Windows XP` machine, since it’ll have features and enhancements that these old systems can also take advantage of.

The only parts worth showing might be the file packaging and patching, so I'll center on those.

The first is designed very simple, with 3 bundled binaries: one for the *app settings* (`App.bin`), other with the *game executables* (`Data.bin`), and the last one with the *video wrapper files* (`Video.bin`), knowing each of the offsets and lengths of the files to extract them at runtime, depending on the options selected:

<br>

<div id="code-1" class="collapsible-hide">Press to show the code</div>

<div id="code-1-data" class="content-hide" markdown="1">
{% highlight cs %}
// Prepare the program configuration.
public static void InitialSetup() {
    SettingsName = Path.GetFileNameWithoutExtension(Default.GetType().Assembly.Location)+ ".bin";
    if (!File.Exists(SettingsName))
        Launcher.ExtractFileFromResources("TTLauncher.Files.App.bin", SettingsName, 0, 16);
    SettingsLoaded = File.ReadAllBytes(SettingsName);
}

private static void UnpackFiles() {
    ExtractFileFromResources("TTLauncher.Files.Data.bin", "TonicTrouble.exe", 16, 967168);
    ExtractFileFromResources("TTLauncher.Files.Data.bin", "SetupTT.exe", 967200, 95744);
    UnpackedFiles.Add("TonicTrouble.exe");
    UnpackedFiles.Add("SetupTT.exe");
}
{% endhighlight %}
</div>

<br>

Then we have the patches, in the form of *byte arrays* (`byte[]`):

<br>

<div id="code-2" class="collapsible-hide">Press to show the code</div>

<div id="code-2-data" class="content-hide" markdown="1">
{% highlight cs %}
private static byte[] VideosPath = new byte[] {
    0x56, 0x69, 0x64, 0x65, 0x6F, 0x73, 0x00, 0x00
};
private static byte[] ConfigurationFile = new byte[] {
    0x2E, 0x69, 0x6E, 0x69, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};
private static byte[] ConfigurationPath1 = new byte[] {
    0x66, 0xC7, 0x00, 0x2E, 0x00, 0x90,
    0x90, 0x90, 0x90, 0x90, 0x90, 0x90
};
private static byte[] ConfigurationPath2 = new byte[] {
    0x8D, 0x84, 0x24, 0x00, 0x01, 0x00, 0x00, 0x53,
    0x56, 0x57, 0x66, 0xC7, 0x00, 0x2E, 0x00, 0x90,
    0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0xBF, 0x80,
    0x83, 0x4D, 0x00, 0x83, 0xC9, 0xFF, 0x33, 0xC0
};
{% endhighlight %}
</div>

<br>

And some functions to apply those:

<br>

<div id="code-3" class="collapsible-hide">Press to show the code</div>

<div id="code-3-data" class="content-hide" markdown="1">
{% highlight cs %}
public static void PatcherPortable(string FileNameInput) {
    BinaryWriter BinWrite = new BinaryWriter(File.Open(FileNameInput, FileMode.Open, FileAccess.ReadWrite));
    BinWrite.BaseStream.Position = 0xD5ACC;
    BinWrite.Write(VideosPath);
    BinWrite.BaseStream.Position = 0xD5B84;
    BinWrite.Write(ConfigurationFile);
    BinWrite.BaseStream.Position = 0xFDD0;
    BinWrite.Write(ConfigurationPath1);
    BinWrite.BaseStream.Position = 0x12D4D;
    BinWrite.Write(ConfigurationPath1);
    BinWrite.BaseStream.Position = 0x41AA6;
    BinWrite.Write(ConfigurationPath2);
    BinWrite.Close();
}

public static void PatcherSetup(string FileNameInput) {
    BinaryWriter BinWrite = new BinaryWriter(File.Open(FileNameInput, FileMode.Open, FileAccess.ReadWrite));
    BinWrite.BaseStream.Position = 0x62E8;
    BinWrite.Write(ConfigurationFile);
    BinWrite.BaseStream.Position = 0x42D;
    BinWrite.Write(ConfigurationPath1);
    BinWrite.BaseStream.Position = 0x5C0;
    BinWrite.Write(ConfigurationPath1);
    BinWrite.Close();
}
{% endhighlight %}
</div>

<br>

Also, a *blanker*, since we need to fill some parts with empty bytes:

<br>

<div id="code-4" class="collapsible-hide">Press to show the code</div>

<div id="code-4-data" class="content-hide" markdown="1">
{% highlight cs %}
public static void PatcherBlanker(string FileNameInput, int Offset, int Lenght) {
    BinaryWriter BinWrite = new BinaryWriter(File.Open(FileNameInput, FileMode.Open, FileAccess.ReadWrite));
    BinWrite.BaseStream.Position = Offset;
    for (int i = 0; i < Lenght; i++)
        BinWrite.Write((byte)0x00);
    BinWrite.Close();
}
{% endhighlight %}
</div>

<br>

Then again, depending on the settings, those’ll be called like this:

<br>

<div id="code-5" class="collapsible-hide">Press to show the code</div>

<div id="code-5-data" class="content-hide" markdown="1">
{% highlight cs %}
// Patch the executable.
Patches.PatcherPortable("TonicTrouble.exe");
// Patch the setup.
Patches.PatcherSetup("SetupTT.exe");
{% endhighlight %}

<br>

{% highlight cs %}
// Make some initial patches, regardless of the configuration set.
private static void InitialPatching() {
    Patches.PatcherBlanker("TonicTrouble.exe", 0xD28A8, 11);
    Patches.PatcherBlanker("TonicTrouble.exe", 0xD28EC, 9);
    Patches.PatcherBlanker("SetupTT.exe", 0x69C4, 9);
}
{% endhighlight %}
</div>

<br>

Finally, we run the game. Note the use of the `-cd-rom:` parameter. This will be activated if the portable mode option is selected, and tells the game the CD drive location. Leaving it empty uses the current directory:

<br>

<div id="code-6" class="collapsible-hide">Press to show the code</div>

<div id="code-6-data" class="content-hide" markdown="1">
{% highlight cs %}
private static void RunGame() {
    Process TonicTrouble = new Process();
    TonicTrouble.StartInfo.FileName = "TonicTrouble.exe";
    if (SettingsLoaded[2] == 0x01)
        TonicTrouble.StartInfo.Arguments = "-cdrom:";
    TonicTrouble.Start();
    CheckGame();
}

private static void CheckGame() {
    System.Threading.Thread.Sleep(1000);
    Process[] CurrentProcess = Process.GetProcessesByName("TonicTrouble");
    foreach (Process Process in CurrentProcess)
        if (Process.ProcessName == "TonicTrouble")
            Process.WaitForExit();
}
{% endhighlight %}
</div>

<br>

# If life gives you tonics, do… ugh…
At the end, the application looks like this:

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/07.png){: .center-image }

<br>

Mind that this is *temporal* and *incomplete*. The version combo is just a placeholder; the plan is to support the other versions as well, but that will require to do everything again, most likely. A fun task, indeed.

<br>

**Update 06/07/20:** Well, it wasn't as bad as I tought, and it was a nice opportunity to do some cleaning and polishing.

<br>

# Finishing it up
As expected, it required quite some refactoring, since now we have **two** different parts that will work with the same code, separated into the *protected/packed* versions, and the *unprotected/unpacked* versions. The first one has already been covered, but we need to adjust everything to also work with the other.

To determine this, first we need a way to identify the executable version, for which I tracked all the releases of the game out in the wild, and to my surprise, most of them used the same executable, even the same data. In code, we just calculate the hash (I chose the `SHA-256` algorithm) and compare with a list:

<br>

<div id="code-7" class="collapsible-hide">Press to show the code</div>

<div id="code-7-data" class="content-hide" markdown="1">
{% highlight cs %}
private static string CalculateCheckSum(string FileName) {
    using (Stream Executable = File.OpenRead(FileName)) {
        byte[] CheckSum = SHA256.Create().ComputeHash(Executable);
        string Formatted = BitConverter.ToString(CheckSum).Replace("-", String.Empty);
        return Formatted; // Then we check for the string on the list.
    }
}

public static List<string> VersionCheckSum = new List<string> {
    // REVIEW ENGLISH : TT221099-PC - SPANISH - PROTECTED
    "17457C330D11621474A50B2852618D7DF53468C24899176CB2AFC951B51518FB",
    // REVIEW ENGLISH : TT221099-PC - ITALIAN - PROTECTED
    "C379FFADD35C738C0041CEB9916CCA31C35C6EC096B1B3F257F2C66000F0BBFA",
    // RETAIL MASTER V5 : TT181099-PC - FRENCH - UNPROTECTED
    "6AD8506714FC86856369FFE834BB22792AEBCD0FF4FAB780E03AA0ADB47643B3",
    // RETAIL MASTER GERMAN V3: TT221099-PC - GERMAN - PROTECTED
    "EA4BE88CEB9BB7C438BEE7F97767CF12C0F9439707A2CDAEE362FFA01C88FDA6",
    // RETAIL MASTER V3 : TT131099-PC - BRAZILIAN|CHINESE|EUROPE|USA - PROTECTED
    "37631F2FE37C07DD4CCDE32C0981685E152AC016920BEB01CCC0E8FC0E53DC57"
};
{% endhighlight %}
</div>

<br>

Now we know exactly what needs to be supported. With a simple test, the program already works with all the protected versions, so we can forget about those (for now). But it didn't work with the unprotected, french version. Just for this one, most functions and structures needed to be changed, since patches aren't the same neither.

Now patches look like this:

<br>

<div id="code-8" class="collapsible-hide">Press to show the code</div>

<div id="code-8-data" class="content-hide" markdown="1">
{% highlight cs %}
private static byte[] VideosPath = new byte[] {
    0x56, 0x69, 0x64, 0x65, 0x6F, 0x73, 0x00, 0x00
};
private static byte[] ConfigurationFile = new byte[] {
    0x2E, 0x69, 0x6E, 0x69, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};
private static byte[] ConfigurationPathProtected1 = new byte[] {
    0x66, 0xC7, 0x00, 0x2E, 0x00, 0x90,
    0x90, 0x90, 0x90, 0x90, 0x90, 0x90
};
private static byte[] ConfigurationPathProtected2 = new byte[] {
    0x8D, 0x84, 0x24, 0x00, 0x01, 0x00, 0x00, 0x53,
    0x56, 0x57, 0x66, 0xC7, 0x00, 0x2E, 0x00, 0x90,
    0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0xBF, 0x80,
    0x83, 0x4D, 0x00, 0x83, 0xC9, 0xFF, 0x33, 0xC0
};
private static byte[] ConfigurationPathUnProtected1 = new byte[] {
    0x90, 0x90, 0x90, 0x90, 0x90, 0x8D,
    0x85, 0xFC, 0xFD, 0xFF, 0xFF, 0x66,
    0xC7, 0x00, 0x2E, 0x00, 0x90, 0x90
};
private static byte[] ConfigurationPathUnProtected2 = new byte[] {
    0x8D, 0x84, 0x24, 0x00, 0x01, 0x00, 0x00, 0x53,
    0x56, 0x57, 0x66, 0xC7, 0x00, 0x2E, 0x00, 0x90,
    0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0xBF, 0x80,
    0x73, 0x4D, 0x00, 0x83, 0xC9, 0xFF, 0x33, 0xC0
};
{% endhighlight %}
</div>

<br>

And functions now admit addresses as parameters:

<br>

<div id="code-9" class="collapsible-hide">Press to show the code</div>

<div id="code-9-data" class="content-hide" markdown="1">
{% highlight cs %}
public static void PatcherPortable(string FileNameInput, int Address1, int Address2, int Address3, int Address4, int Address5) {
    byte[] ConfigurationPath = SetConfiguration(2);
    BinaryWriter BinWrite = new BinaryWriter(File.Open(FileNameInput, FileMode.Open, FileAccess.ReadWrite));
    BinWrite.BaseStream.Position = Address1;
    BinWrite.Write(VideosPath);
    BinWrite.BaseStream.Position = Address2;
    BinWrite.Write(ConfigurationFile);
    BinWrite.BaseStream.Position = Address3;
    BinWrite.Write(ConfigurationPathProtected1);
    BinWrite.BaseStream.Position = Address4;
    BinWrite.Write(ConfigurationPathProtected1);
    BinWrite.BaseStream.Position = Address5;
    BinWrite.Write(ConfigurationPath);
    BinWrite.Close();
}

// Set the correct patch to apply depending on the protection level.
private static byte[] SetConfiguration(int Configuration) {
    if (Launcher.IsProtected())
        if (Configuration == 1)
            return ConfigurationPathProtected1;
        else
            return ConfigurationPathProtected2;
    else
        if (Configuration == 1)
            return ConfigurationPathUnProtected1;
        else
            return ConfigurationPathUnProtected2;
}
{% endhighlight %}
</div>

<br>

Those are called like this:

<br>

<div id="code-10" class="collapsible-hide">Press to show the code</div>

<div id="code-10-data" class="content-hide" markdown="1">
{% highlight cs %}
// Patch the game and setup executables.
private static void PatchExecutables() {
    // For unprotected versions.
    if (SettingsLoaded[0] == 0x02) {
        Patches.PatcherPortable(ExeGame, 0xD56CC, 0xD5784, 0xFCF0, 0x12C5D, 0x40EF6);
        Patches.PatcherSetup(ExeSetup, 0x70E8, 0x439, 0x5D9);
    }
    // For protected versions.
    else {
        Patches.PatcherPortable(ExeGame, 0xD5ACC, 0xD5B84, 0xFDD0, 0x12D4D, 0x41AA6);
        Patches.PatcherSetup(ExeSetup, 0x62E8, 0x42D, 0x5C0);
    }
}
{% endhighlight %}
</div>

<br>

Now with this, everything is working as expected. The game version is detected and the correct patches are applied. But we're not done yet. In fact, this whole thing brought to my scope a detail that I missed at some point.

The *intro video* is something special. If it's not detected, it just doesn't play, and the game continues. Because of this, there's the video path patch, but that's not enough. Each version has a different language, and there's one folder that's named before it (**English**, **French**, **German**, **Italian** and **Spanish**). If the folder has not the correct name, the intro won't play neither (and maybe some sounds). It was a pretty lame oversight, since I tested the video patch with the english version and everything worked fine (`English` is the default value), but later moved development to the italian version, and didn't notice that it didn't play at all. After inspecting the executable, all of them have the same `English` directory, but changing it didn't do anything, so the configuration has to be somewhere else. It turns out I was missing an entry in the `Ubi.ini` file, `Language`. It overrides the source path with the one specified, so it was actually important to include (there're a lot of useless settings written in the `Ubi.ini` file, so unless necessary I just skip its inclusion).

<br>

<div id="code-11" class="collapsible-hide">Press to show the code</div>

<div id="code-11-data" class="content-hide" markdown="1">
{% highlight cs %}
if (!File.Exists("Ubi.ini"))
    using (StreamWriter Stream = File.CreateText("Ubi.ini")) {
        Stream.WriteLine("[TONICT]");
        // Needed for the game and setup executables.
        Stream.WriteLine("Directory=");
        // Necessary to play the intro video and some sounds.
        Stream.WriteLine("Language=" + CheckSum.VersionLanguage[SettingsLoaded[0]]);
    }

public static List<string> VersionLanguage = new List<string> {
    "Spanish",
    "Italian",
    "French",
    "German",
    "English"
};
{% endhighlight %}
</div>

<br>

And now, this time for real, we're pretty much done. Every feature has been tested with every version, and everything is working and looking *nice and good*.

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/08.png){: .center-image }

<br>

After this I'll re-think about supporting the ***Special Edition...***
