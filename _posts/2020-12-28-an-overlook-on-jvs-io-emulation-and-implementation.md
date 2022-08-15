---
layout: post
language: "en"
code: "an-overlook-on-jvs-io-emulation-and-implementation"
title: An overlook on JVS I/O emulation and implementation
description: How we get to run PC-based arcade software at home, and expanding on what already exists.
thumb: /assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/thumb.jpg
---

# Introduction
It’s been almost two decades since PCs have become a reliable platform for arcades, and the high success of the **Type X** platform from **Taito** settled that down to never go back. The logistics are simple, out off the shelf components with mass production are cheaper to manufacture and give support, reducing overall costs. Not only this, but software would be easier and more accessible to develop, since the platform that will run on top of is not only very well-known, but also a lot more standardized. *PC-based arcades* have the potential to open arcade software development to a wider amount of developers.

The only downside might be piracy and *bootlegging*, and though it’s always been a problem in the arcade scene, this time could go stronger since PCs, as simple as it is to develop for, the same could be said for cracking protections and decrypting information. These form part of the layer that prohibits us from running the software on normal PCs, in conjunction with the *I/O devices*.

<br>

# Some history
Despite the vast amount of PC-based arcade platforms that appeared through time, going strong until this day, I’ll just be focusing on two specific hardware machines and their software: **Taito Type X** and **Examu eX-BOARD**, one was a *classic*, the other a *failure*, but both were pioneers in the PC-based arcade movement.

The story dates back to 2009-2011 (I can’t remember exactly), when data dumps of most of the Type X games, some of **X2**, and all the eX-BOARD titles were released in arcade forums. This data was unprotected, which means that no security devices or checks were needed for the games to work. I can’t recall if the emulator for I/O was also released at the same time, but for sure shortly after one appeared. This first *loader* did just that, emulate the I/O device, and thus removing the final wall that prevented the software to be run without displaying an `I/O ERROR` screen.

Some time after, **Romhack** reworked this emulator into the *open-source Type X I/O emulator*, **ttx_monitor**, and later built on top of it the *eX-BOARD variant*, **xb_monitor**. He later also did a *Cave-PC variant*, **cv_monitor**, but to my knowledge it hasn’t been open-sourced. The Romhack emulators became the default to use during a long time, until more recently other capable alternatives appeared, like **JConfig** and **TeknoParrot**, and despite these emulate much more I/O devices of other machines as well, the Type X and eX-BOARD cores are all based on Romhack’s emulators. Now even myself entered the trend, and made *enhanced versions* of both ttx_monitor and xb_monitor, **TTX-Monitor+** and **XB-Monitor+** respectively.

<br>

# What to expect
First, we’ll take a quick look at the protection of the software at a high level, to then go into the hardware (and **JVS** overall), how to emulate it, analyze Romhack’s implementation and building on top of the existing, adding features and some quality of life enhancements.

Since I don’t own any arcades, some basic terminology such as **JAMMA** was unknown to me, and still kind of is, so my only supports are the original JVS documentation and Romhack’s code, besides some *self-play* with the software which uses those devices. Still, I think it was enough to understand how things work, hence the *high-level* remark. That being said, this write might be only enjoyed by casual people that aren't on topic, and don’t be surprised if any inaccuracies present during the lecture.

<br>

# Protection at its finest
Older machines implemented some *nasty* and *wild* protection, even at a hardware level, like suicidal chips and batteries. Thankfully, we don’t have any of that kamikaze protection, it’s just a simple USB *dongle check*, but let’s dive into it. The hard disk drive has two partitions:

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/00.png){: .center-image }

{: .center-text }
**Chaos Breaker** cloned hard disk drive image.

<br>

The first has a `Windows XP Embedded` install, a Type X *loader/launcher* and a *virtual image disk* with the game data.

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/01.png){: .center-image }

{: .center-text }
The root of the **C:** partition, the **TypeXsys** folder contents and last the encrypted disk image inside the **data** folder with the game data. Also, **yes.txt**.

<br>

The loader does hardware checks (dongle, disk drive, partitions) and if everything is okay, a key is retrieved, which decrypts the image file, thus being able to run the game. Once the game is executed, it checks for a valid **JVS I/O device** in the **COM2 port**. If present, the game continues normally reaching full execution, and if not, the *I/O board error* will show up.

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/02.png){: .center-image }

{: .center-text }
I/O error screens from **Trouble Witches** and **GigaWing Generations**, respectively.

<br>

There’s also a second partition, which stores all the game configuration and data. The only reason I can think of this is that the first partition might be *read-only*, or at least nothing is written over there.

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/03.png){: .center-image }

{: .center-text }
A sole partition just for this.

<br>

In the case of eX-BOARD games, those were delivered in **IDE cartridges**, being by itself enough protection. Or that’s why Examu thought at least, being cracked in short time. In lack of more documentation about the protection, looking at xb_monitor code we see a hook in the library `IpgExKey.dll`, function `_GetKeyLicense@0`:

<br>

<div id="code-0" class="collapsible-hide">Press to show the code</div>

<div id="code-0-data" class="content-hide" markdown="1">
{% highlight cpp %}
BOOL APIENTRY HookFunctions() {
  // eX-BOARD software function hooks.
  HGetKeyLicense = HookIt("IpgExKey.dll", "_GetKeyLicense@0", Hook_GetKeyLicense);
}

INT APIENTRY Hook_GetKeyLicense(VOID) { return 1; }
{% endhighlight %}
</div>

{: .center-text }
Function hook in XB-Monitor+.

<br>

Loading the DLL in **Ghidra**, we can see all exported functions, `GetKeyLicense` being one of them:

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/04.png){: .center-image }

<br>

I think it’s safe to assume from its name that it handles the *protection check*, so making it always return *true* is enough to bypass it. Now with the decrypted data and protection cracked, the only barrier left is the JVS I/O device.

<br>

# Communication Device
The JVS board has the I/O functionality in a *separated board*, which has a JAMMA connector for the controllers, and a **CN2** to **USB** connector, for data transfer between the **main I/O board** and the **child TAITO I/O board** inside the Type X itself. Despite the USB physical connection, the **JVS protocol** is used for data transfer through **RS-485** serial transmission. This child board is connected to the COM2 port on the motherboard, so we can say that it works as an interface between the I/O board and the machine itself.

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/05.png){: .center-image }

{: .center-text }
Schematics of the Type X, JVS main board and JVS I/O board connected to the child I/O board.

<br>

The software then reads the input data from the COM2 port device. The data is transferred in **packets** through the JVS protocol:

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/06.png){: .center-image }

{: .center-text }
JVS protocol package structure.

<br>

To put it simply, the `Sync Code` determines the start of a valid JVS packet, which always has the value of `0xE0`. The `Node` indicates the destination address, or the slave device/node of destination. The `Byte` determines the size of the rest of the packet, including the *checksum*, and this sum helps to identify if a packet is corrupt or not. The `Data` is, precisely, the data, which is formed by a *command* and arguments. There’s a large list of commands for different functions. In emulation, most of the commands are hardcoded for the initialization of the I/O board, so the one that really matters to us is the command `0x20`, `SWINP`, or more friendly, **Switch Inputs**:

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/07.png){: .center-image }

{: .center-text }
Command `SWIMP` byte data for normal inputs (there’s also for mahjong panels and dual sticks).

<br>

So, how do we emulate this process?

<br>

# I/O Emulation
Since the JVS I/O board is connected into the COM2 port, we need a **fake COM device** that will let us make any input device behave as JVS compatible. For this, we *inject* our own *hooks* for the **COM functions** in the system library `Kernel32` for the running process, that will retrieve the correct data from the fake virtual device we created.

<br>

<div id="code-1" class="collapsible-hide">Press to show the code</div>

<div id="code-1-data" class="content-hide" markdown="1">
{% highlight cpp %}
BOOL APIENTRY HookFunctions() {
  // Communications devices function hooks.
  HOOK("kernel32.dll", ClearCommError, H, LP, Hook);
  HOOK("kernel32.dll", CloseHandle, H, LP, Hook);
  HOOK("kernel32.dll", EscapeCommFunction, H, LP, Hook);
  HOOK("kernel32.dll", GetCommModemStatus, H, LP, Hook);
  HOOK("kernel32.dll", GetCommState, H, LP, Hook);
  HOOK("kernel32.dll", GetCommTimeouts, H, LP, Hook);
  HOOK("kernel32.dll", SetCommMask, H, LP, Hook);
  HOOK("kernel32.dll", SetCommState, H, LP, Hook);
  HOOK("kernel32.dll", SetCommTimeouts, H, LP, Hook);
  HOOK("kernel32.dll", SetupComm, H, LP, Hook);
}
{% endhighlight %}
</div>

<br>

In concept is simple, we create a *stream of data* that will *simulate* the JVS transfer structure, build the correct packets and return a valid reply. Basically, we feed the data that the stream wants to hear. The interesting part is the request of command `0x20`, when the second part of the emulation comes to play.

Besides the fake COM device, we also need a *true input layer*, which then we can link with the former and thus generating the input signals through a **virtual JVS packet**. For this, we create two `DirectInput` devices (although any input *API* would work, we use DInput since the games by themselves also use it, so we need it anyways): a *fake* one, which is hooked into the game so it doesn’t detect any inputs, and a *real* one, that will read our inputs from the selected device. This way, we cancel any input read from the game, and we inject our inputs into the JVS stream, which then will be read by the game.

<br>

<div id="code-2" class="collapsible-hide">Press to show the code</div>

<div id="code-2-data" class="content-hide" markdown="1">
{% highlight cpp %}
// Prevents the games of having access to input devices.
HRESULT APIENTRY Fake_DirectInput8Create(HINSTANCE hinst, DWORD dwVersion, REFIID riidltf, LPVOID* ppvOut, LPUNKNOWN punkOuter) {
  // Flag to make a true DInput device after the fake one was already created.
  if (DIMagicCall)
    // Passthrough to create a normal DInput device.
    return FDirectInput8Create(hinst, dwVersion, riidltf, ppvOut, punkOuter);
  else {
    *ppvOut = (LPVOID)pFakeInterface;
    punkOuter = NULL;
    // This device returns null when GetState() is called, thus no inputs are registered.
    return DI_OK;
  }
}
{% endhighlight %}
</div>

<br>

The DInput initialization behaves as normal, the devices are enumerated, acquire the one we want and finally create a **polling thread**. When we press a key/button on the device, it will set a *flag* in an *input state array*, which is read by the **JVS stream polling**.

<br>

<div id="code-3" class="collapsible-hide">Press to show the code</div>

<div id="code-3-data" class="content-hide" markdown="1">
{% highlight cpp %}
// Check for a joystick command.
if (IS_JOY_OBJECT(InValue)) {
  // Check joystick axes and buttons.
}
// Check for keyboard commands.
else {
  int Button = GET_JOY_BUT(InValue);
  StateTable[i] = JoyState[JoyNumber].rgbButtons[Button] & 0x80 ? 1 : 0;
}
{% endhighlight %}
</div>

{: .center-text }
Check if the polled key is pressed and set the corresponding flag in the array.

<br>

<div id="code-4" class="collapsible-hide">Press to show the code</div>

<div id="code-4-data" class="content-hide" markdown="1">
{% highlight cpp %}
// Controller status. Command SWINP.
case 0x20: {
  // Push to byte 0.
  JVS.bPush(InputMgr.GetState(TEST_MODE) ? 0x80 : 0);
  // Push to bytes 1 and 2.
  JVS.bPush(InInfo.Xp1HiByte());
  JVS.bPush(InInfo.Xp1LoByte());
  JVS.bPush(InInfo.Xp2HiByte());
  JVS.bPush(InInfo.Xp2LoByte());
  break;
}
{% endhighlight %}
</div>

{: .center-text }
Then the JVS polling will get the state of the input table and process it.

<br>

When the fake JVS detects the flag, it sets the *bit* in the corresponding *byte* of the **Input Switch data block**:

<br>

<div id="code-5" class="collapsible-hide">Press to show the code</div>

<div id="code-5-data" class="content-hide" markdown="1">
{% highlight cpp %}
BYTE Xp1HiByte() {
  BYTE Byte = 0;
  if (InputMgr.GetState(P1_START))
    Byte |= 0x80;
  if (InputMgr.GetState(P1_SERVICE))
    Byte |= 0x40;
  if (InputMgr.GetState(P1_UP))
    Byte |= 0x20;
  if (InputMgr.GetState(P1_DOWN))
    Byte |= 0x10;
  if (InputMgr.GetState(P1_RIGHT))
    Byte |= 0x04;
  if (InputMgr.GetState(P1_LEFT))
    Byte |= 0x08;
  if (InputMgr.GetState(P1_BUTTON_1))
    Byte |= 0x02;
  if (InputMgr.GetState(P1_BUTTON_2))
    Byte |= 0x01;
  return Byte;
}

BYTE Xp1LoByte() {
  BYTE Byte = 0;
  if (InputMgr.GetState(P1_BUTTON_3))
    Byte |= 0x80;
  if (InputMgr.GetState(P1_BUTTON_4))
    Byte |= 0x40;
  if (InputMgr.GetState(P1_BUTTON_5))
    Byte |= 0x20;
  if (InputMgr.GetState(P1_BUTTON_6))
    Byte |= 0x10;
  return Byte;
}
{% endhighlight %}
</div>

{: .center-text }
Setting up the first 2 bytes, which belong to P1's inputs.

<br>

Finally, the packet is sent and the function returns, the reply is buffered and then it’s interpreted by the game as a *legit* JVS I/O button press.

<br>

# Excellent, now what
All we’ve seen so far is what was implemented in Romhack’s loaders. This includes the JVS I/O emulation and the input handling. The first works as expected, but the latter, while works, is lacking some, in *my* opinion, *basic features*. Most of them were made popular by loaders like JConfig, so it makes it feel outdated in comparison.

But why not use the modern alternatives then? Because, for whatever reason, *none* of them have support for Examu’s eX-BOARD titles, and by them I mean JConfig, because TeknoParrot seems to support the platform, but since it had a very sketchy past (**VMProtect** anyone?), I don’t really like to use the software itself, so I prefer to avoid it, even if that means to develop my own solution.

Here’s where my enhanced version of the *only* open source solution available, xb_monitor, comes to play, trying to put the old loader up to modern alternatives. And since I was already there, I also decided to apply the same treatment to ttx_loader, because *why not* (and well, both share most of the code anyways), though later I’d find a good use for it. But before going through those new features, it’s important to remark that both projects have seen a big overhaul of the *codebase*, in such a way that *I* feel is much better to read and understand, so if you want to see the inner works, might want to check TTX-Monitor+ and XB-Monitor+ over the originals.

<br>

# QOL Enhancements
First, *controls*. The *deadzone* values for the axis were *too* low, so in modern and sensitive controllers, like the `Xbox Controller` and `DualShock 4`, it was literally *impossible* to configure and play with analog sticks, let alone if you have *drifting* issues like myself, even if they’re minimal. Incrementing this hardcoded value a bit was enough to fix this issue.

<br>

<div id="code-6" class="collapsible-hide">Press to show the code</div>

<div id="code-6-data" class="content-hide" markdown="1">
{% highlight cpp %}
#define DEADZONE 500 /*(MAX_AXIS_VAL / DEADZONE_DIV)*/
{% endhighlight %}
</div>

{: .center-text }
The new deadzone value (500), with the old implementation commented out (10).

<br>

In the function for input pooling, only the left axis (`AxisL`) and buttons were checked, *very limited*. Support for the right axis (`AxisR`), triggers (`AxisZ`) and `POVs` were added, in addition to a `PovAsAxis` option, which allows to use POVs together with the left axis mapped inputs (like the `Analog` button on DualShock controllers).

<br>

<div id="code-7" class="collapsible-hide">Press to show the code</div>

<div id="code-7-data" class="content-hide" markdown="1">
{% highlight cpp %}
// Axis definitions.
#define AXIS_X              1
#define AXIS_Y              2
#define AXIS_Z              3
#define AXIS_RX             4
#define AXIS_RY             5
#define POVN                10
// POVs definitions.
#define POV_CENTER          -1
#define POV_UP              0
#define POV_UP_RIGHT        4500
#define POV_RIGHT           9000
#define POV_RIGHT_DOWN      13500
#define POV_DOWN            18000
#define POV_DOWN_LEFT       22500
#define POV_LEFT            27000
#define POV_LEFT_UP         31500

// Polling of joystick axes and POVs.
switch (GET_JOY_AXIS(InValue)) {
  case AXIS_X: {
    if (IS_NEGATIVE_AXIS(InValue)) {
      if ((JoyState[JoyNumber].lX < -DEADZONE) || (mTable[CONFIG_POVASAXIS] &&
      ((Dir == POV_LEFT) || (Dir == POV_DOWN_LEFT) || (Dir == POV_LEFT_UP))))
        StateTable[i] = 1;
    }
    else {
      if ((JoyState[JoyNumber].lX > DEADZONE) || (mTable[CONFIG_POVASAXIS] &&
      ((Dir == POV_RIGHT) || (Dir == POV_UP_RIGHT) || (Dir == POV_RIGHT_DOWN))))
        StateTable[i] = 1;
    } break;
  }
  case POVN: {
    // To avoid problems, mapped POVs are disabled and
    // forced to work as axis if PovAsAxis option is enabled.
    if ((JoyState[JoyNumber].rgdwPOV[0] != -1) && !mTable[CONFIG_POVASAXIS]) {
      if (GET_JOY_RANGE(InValue) == POV_UP &&
      ((Dir == POV_UP) || (Dir == POV_UP_RIGHT) || (Dir == POV_LEFT_UP)))
        StateTable[i] = 1;
      if (GET_JOY_RANGE(InValue) == POV_RIGHT &&
      ((Dir == POV_RIGHT) || (Dir == POV_UP_RIGHT) || (Dir == POV_RIGHT_DOWN)))
        StateTable[i] = 1;
      if (GET_JOY_RANGE(InValue) == POV_DOWN &&
      ((Dir == POV_DOWN) || (Dir == POV_RIGHT_DOWN) || (Dir == POV_DOWN_LEFT)))
        StateTable[i] = 1;
      if (GET_JOY_RANGE(InValue) == POV_LEFT &&
      ((Dir == POV_LEFT) || (Dir == POV_DOWN_LEFT) || (Dir == POV_LEFT_UP)))
        StateTable[i] = 1;
    } break;
  }
}
{% endhighlight %}
</div>

{: .center-text }
Extract from the input polling function.

<br>

Now that we're done with controls, I’ll touch in some features that I thought were unnecessary to include: the *logging functions* and the `DirectDraw` wrapper. The former is still present *code-wise*, and is available as a *debug tool* just for development, instead of always being on and creating logs that most users don’t care at all. While the DirectDraw wrapper has been removed, the `Direct3D 9` was required for XB-Monitor+, but has been reduced to a single purpose: fix the window drawing in **Arcana Heart 3**. The original implementation was more complex, but for this I just forced *fullscreen* mode @`640x480`, like the rest of eX-BOARD games do.

<br>

<div id="code-8" class="collapsible-hide">Press to show the code</div>

<div id="code-8-data" class="content-hide" markdown="1">
{% highlight cpp %}
HRESULT HookIDirect3D9::CreateDevice(LPVOID _this, UINT Adapter, D3DDEVTYPE DeviceType, HWND hFocusWindow, DWORD BehaviorFlags, D3DPRESENT_PARAMETERS* pPresentationParameters, IDirect3DDevice9** ppReturnedDeviceInterface) {
  pPresentationParameters->Windowed = FALSE;
  pPresentationParameters->BackBufferWidth = 640;
  pPresentationParameters->BackBufferHeight = 480;
  return pD3D->CreateDevice(Adapter, DeviceType, hFocusWindow, BehaviorFlags,pPresentationParameters, ppReturnedDeviceInterface);
}
{% endhighlight %}
</div>

{: .center-text }
The important part of the wrapper.

<br>

This decision was in favor of the use of *external wrappers*, like the *excellent* **dgVoodoo**, which not only could solve *incompatibilities* in modern systems (particularly important since these machines came out around 2004-2008), but also *enhance* the visuals. Other loaders like JConfig have wrappers included to have a more *out-of-the-box* experience, but under mine those are very limited and don’t work pretty well, or lack features.

Last but not least, a `SavePatch` feature. As shown at the beginning of the article, most games stored their options and score data in a different partition. Their behaviour didn’t change and they will attempt to save there. The problems are, not everyone has a second partition with the specified drive letter, and we don’t want our data to be *all over the place*. To fix this, we redirect all the file and directory operations to a specified *save folder* in the root directory of the application.

For eX-BOARD games is simple, since the data isn’t stored in the hard drive, but rather in *volatile memory* (although I don’t know specifically in which form), so we create a **virtual SRAM** file, which then is loaded in memory. xb_monitor already placed the SRAM binary data in the `sv` folder, a structure that’s used in JConfig and *binary patches*, and will be carried over XB-Monitor+ and TTX-Monitor+ as well.

<br>

<div id="code-9" class="collapsible-hide">Press to show the code</div>

<div id="code-9-data" class="content-hide" markdown="1">
{% highlight cpp %}
VOID SaveSRAM() {
  FILE* Stream = NULL;
  Stream = fopen(SRAM_NAME, "wb");    
  if (!Stream) { return; }
  fwrite(SRAM, 1, SRAM_SIZE, Stream);
  fclose(Stream);
}
{% endhighlight %}
</div>

<br>

But Type X is a different *beast*, that looks simple at first, but its implementation gets complicated. In *theory* we hook our own `CreateDirectory` and `CreateFile` system functions (both *ANSI* and *wide character* variants) and call it a day, but when we start to deal with subdirectories *this shit gets annoying*. With the current implementation, I’ve got all games saving in the save directory, but some like **The King Of Fighters '98**, **Gouketsuji Ichizoku Senzo Kuyou** and **Trouble Witches** won’t read the data back. While it might be fixable, perhaps with a different algorithm, it wasn’t worth the hassle, considering that other loaders probably have *game-specific* patches (certainly TeknoParrot), while I aim for a more *dynamic* approach.

<br>

<div id="code-10" class="collapsible-hide">Press to show the code</div>

<div id="code-10-data" class="content-hide" markdown="1">
{% highlight cpp %}
using namespace std::literals;

// Beautiful recursion. Necessary for games which create subfolders for savedata.
void CreateFolderA(CHAR* SaveFolder, CHAR* SaveSubFolderC) {
  if (strcmp(SaveFolder, SaveSubFolderC) != 0) {
    CHAR SaveSubFolder[MAX_PATH];
    strcpy(SaveSubFolder, SaveSubFolderC);
    strrchr(SaveSubFolderC, '\\')[0] = '\0';
    CreateFolderA(SaveFolder, SaveSubFolderC);
    HCreateDirectoryA(SaveSubFolder, nullptr);
  } else { HCreateDirectoryA(SaveFolder, nullptr); }
}

BOOL APIENTRY Hook_CreateDirectoryA(LPCSTR lpPathName, LPSECURITY_ATTRIBUTES lpSecurityAttributes) {
  if (mTable[CONFIG_SAVEPATCH]) {
    // Assuming that no Type X game store data in the C: drive. Excludes relative paths.
    if ((lpPathName[0] != 'C' && lpPathName[0] != 'c') && lpPathName[1] == ':') {
      CHAR RootPath[MAX_PATH];
      GetModuleFileNameA(GetModuleHandleA(nullptr), RootPath, _countof(RootPath));
      strrchr(RootPath, '\\')[0] = '\0';
      std::string SavePath = RootPath + "\\sv\\"s;
      return HCreateDirectoryA(SavePath.c_str(), nullptr);
    }
  } return HCreateDirectoryA(lpPathName, lpSecurityAttributes);
}

HANDLE APIENTRY Hook_CreateFileA(LPCSTR lpFileName, DWORD dwDesiredAccess, DWORD dwShareMode, LPSECURITY_ATTRIBUTES lpSecurityAttributes, DWORD dwCreationDisposition, DWORD dwFlagsAndAttributes, HANDLE hTemplateFile) {
  if (mTable[CONFIG_SAVEPATCH]) {
    // Assuming that no Type X game store data in the C: drive. Excludes relative paths.
    if ((lpFileName[0] != 'C' && lpFileName[0] != 'c') && lpFileName[1] == ':') {
      // Get game working directory.
      CHAR RootPath[MAX_PATH];
      GetModuleFileNameA(GetModuleHandleA(nullptr), RootPath, _countof(RootPath));
      // Strip executable filename from path.
      strrchr(RootPath, '\\')[0] = '\0';
      std::string FilePath = lpFileName;
      // Forced to 3 to skip both slashes and backslashes.
      std::string FileName = FilePath.substr(3);
      // Get working directory lenght.
      int PathLenght = 0;
      for (int i = 0; i < MAX_PATH; i++)
        if (RootPath[i] == '\0') {
          PathLenght = i;
          break;
        }
      // Exclude directory files. Avoids screwing up normal file operations.
      if (strncmp(lpFileName, RootPath, PathLenght) != 0) {
        std::string SavePath = RootPath + "\\sv\\"s;
        std::string SaveFile = SavePath + FileName;
        std::string SaveSubFolderS = SaveFile.substr(0, SaveFile.length() - (FileName.length() - FileName.rfind('\\')));
        CHAR SaveFolder[MAX_PATH];
        strcpy(SaveFolder, (SavePath.substr(0, SavePath.length() - 1)).c_str());
        CHAR SaveSubFolderC[MAX_PATH];
        strcpy(SaveSubFolderC, SaveSubFolderS.c_str());
        CreateFolderA(SaveFolder, SaveSubFolderC);
        return HCreateFileA(SaveFile.c_str(), dwDesiredAccess, dwShareMode, lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes, hTemplateFile);
      }
    }
  } return HCreateFileA(lpFileName, dwDesiredAccess, dwShareMode, lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes, hTemplateFile);
}
{% endhighlight %}
</div>

{: .center-text }
System function hooks for directory and file redirection.

<br>

Something important to point out is that we only redirect file operations that aren’t relative to the current path. This way we don’t fuck up with the games trying to read their own data files.

<br>

# Introducing mahjong input support
The brand *new* and *exciting* feature *unique* to TTX-Monitor+ is support for **mahjong games**. Well, actually only **Taisen Hot Gimmick 5** for now, maybe **Taisen Hot Gimmick Mix Party** in the future. There’s quite some history with mahjong games and their JVS I/O emulation.

Apparently, while both use indeed JVS for I/O communication, it seems like a *custom implementation*, since JVS is *flexible enough* to do this. *Why?* I don’t know, they could’ve stuck with the standard (you know, the `S` part) mahjong panel handling. The people behind JConfig have been trying to figure this out, and told me that a *different* **JVS dump** is needed in order to provide the *correct data* the games are expecting. Until then, let’s go for a *hacky* solution.

Luckily for us, the developers left keyboard controls for *debugging*, or at least on `THG5`, which uses DirectInput. `THGMP` doesn’t, though it seems to map some keys, which aren’t activated for some reason. I’m still investigating this, so hopefully there’s a way to unlock the keyboard for THGMP. It should work until a proper way to emulate the mahjong JVS I/O is finally sorted out.

The *only* loader that was able to run THG5 with the debug controls is the original, the first released `TypeX Loader`. The reason for this is that every other loader creates a fake DirectInput device to prevent the games from taking inputs by themselves, forcing only the virtual JVS inputs to be recognized. For mahjong titles, this hook was *disabled*, leaving the game to take the inputs, and despite the loader offering a mahjong panel input configuration, it was never implemented and *never worked*. We’ll be doing the first, and *fix* the later.

So, with this in mind, the idea is to give the *fake feeling* of proper emulation, by enabling the *remapping* of the keyboard keys to any device, including the keyboard itself. For this, a DirectInput wrapper is implemented, with some algorithm complexity. Basically, it takes care of all the input handling, and manages the *original* and *user* mapped keys. This way, we want to avoid any conflicts that might occur when *overlapping* the original and user configuration.

While it sounded simple at first, it was quite challenging to implement correctly. All the mahjong input configuration has been separated from the normal input, to make it easier and cleaner to develop and understand.

<br>

<div id="code-11" class="collapsible-hide">Press to show the code</div>

<div id="code-11-data" class="content-hide" markdown="1">
{% highlight cpp %}
// Only limitation is that if a key is mapped to a pointer of another key, both of those
// can't be pressed at the same time. Example: 'A' is mapped to the 'A' key, and 'B' is
// mapped to '1'. Both can't be pressed at the same time because 'A' originally points to '1'.
void PollInputMulti(int ThreadNumber) {
  for (;;) {
    // +3 is the mahjong inputs offset.
    if (InputMgr.GetState(ThreadNumber + 3)) {
      // Avoid the thread to process a key already being processed by another.
      if (isPressed[ThreadNumber] == 0) {
        isPressed[ThreadNumber] = 1;
        INPUT Input = { 0 };
        Input.type = INPUT_KEYBOARD;
        Input.ki.wScan = MapVirtualKey(LOBYTE(VI_CODES[ThreadNumber]), 0);
        // Value needed for the releasing of pointed keys.
        int isPointer = 0xFF;
        // Check if the key pressed has a pointer key.
        for (int k = M_START; k < M_END; k++)
          if ((DIK_CODES[ThreadNumber] == iTable[k])) {
            isPointer = k;
            break;
          }
        if (isPointer != 0xFF)
          isPressed[isPointer] = 2;
        // SendInput loop.
        while (InputMgr.GetState(ThreadNumber + 3)) {
          Input.ki.dwFlags = KEYEVENTF_SCANCODE;
          SendInput(1, &Input, sizeof(Input));
          Sleep(10); // Pause necessary for the next key to be recognized.
          Input.ki.dwFlags = KEYEVENTF_KEYUP;
          SendInput(1, &Input, sizeof(Input));
        }
        // Wait for another thread to process and reject the last SendInput,
        // in case the sent key pointed to an also mapped key.
        Sleep(50);
        if (isPointer != 0xFF)
          isPressed[isPointer] = 0;
        isPressed[ThreadNumber] = 0;
      }
    } Sleep(20); // Reduce the thread processing.
  }
}
{% endhighlight %}
</div>

{: .center-text }
Multi-threaded version of the polling algorithm.

<br>

For the input polling, a *new thread* is created for *each* button. At first I wanted to make the thread count arbitrary, but that wasn’t going anywhere. Also, single thread polling is available, which *funnily enough* fixes a problem of how inconsistently the game handles multiple input presses.

<br>

# One final touch
Now that all the core features and enhancements, *planned and not*, are implemented, there’s one more thing to track down: the *user interface*. The original UI (**ttx_config**) was very simple, made with the `MFC Application Wizard`. It did the job, but it copied the code from the main loader, meaning that all the controller features will shave to be ported over there, plus adding mahjong support.

Instead of updating the old UI, I went with a new `.NET Windows Forms` solution made from scratch. Well, *kind of*, since I had most of it done for another *arcade-related* project, including all the interface operations and controller integration, through the `DirectInput API`. When I first developed this, it took quite the time, considering that I had never worked with `DirectX` nor any input API before, but at the same time it helped me a lot to understand the whole input implementation in ttx_monitor and xb_monitor.

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/08.png){: .center-image }

{: .center-text }
Also put my graphic designer skills to show with two brand new logos and icons, **neat.**

<br>

# Might not be over yet
While I consider everything *mostly* done, there’s still that mahjong game *bugging* me. I’ll give it a shot to see if I can get it to work with the debug keyboard controls that I *suspect* are there, but just disabled. If so, the current mahjong engine *should* work, maybe with some modifications.

However, the game behaves *differently* than TGH5: TGHMP is a collection of the first 4 games in the series. Each game has its own executable on its own folder, including the *test mode* and the *special menu* to select the game. It turns out that `game.exe` is the process which handles the **child process creation** and the **JVS communication**, acting as a *pipeline* to the real game processes. For this reason, this game is a *pain* to debug, so it’s not very straightforward as it’d usually be. Still, I’ll give it a try.

It was a long journey that I don’t consider over yet, but I take the experience of *programming in C for the first time*, implementing new core features in someone else's project, and just learning more about how modern arcade machines work.

<br>

# References

[JVS - Arcade Otaku](https://wiki.arcadeotaku.com/w/JVS)

[JVS I/O - PCB Otaku Wiki](https://wiki.pcbotaku.com/wiki/JVS_I/O)

[JVS Protocol - OpenJVS](https://github.com/TheOnlyJoey/openjvs/wiki/Protocol)

[Taito Type X User Manual - TAITO](https://usermanual.wiki/Document/TaitoTypeXManualJapanese.2482189640/html)

[JAMMA Video Standard (The Third Edition) (JVS) - JAMMA](http://superusr.free.fr/arcade/JVS/JVST_VER3.pdf)

[JAMMA Video Standard (JVS) Third Edition - Alex Marshall](http://daifukkat.su/files/jvs_wip.pdf)

[PC Hardware in Arcades, an Analysis - Alex Marshall](http://daifukkat.su/blog/archives/2012/01/14/pc_hardware_in_arcades_an_analysis/)
