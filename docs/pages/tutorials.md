---
layout: default
title: Volatco Tutorials
permalink: /pages/tutorials/
---

# Blink an LED with Volatco

Make an LED blink from a Volatco GPIO signal.

## What You Will Need

- A Volatco board with power and programming access
- One mini-red LED with forward voltage `Vp = 2.0 V`
- One `550 ohm` current-limiting resistor
- Jumper wires
- A breadboard or another safe way to connect the LED
- A serial or IDE connection to the board

![Mini-red LED used in this tutorial](../assets/led-3mm-red-diffused.jpg)

In most through-hole LEDs like this one, the longer lead is the anode and the shorter lead is the cathode.

## Parts Note

This tutorial uses a `550 ohm` resistor and a mini-red LED with `Vp = 2.0 V`.

Volatco GPIO behavior is documented around a `1.8 V` supply. A `2.0 V` LED may not leave enough headroom for useful current to flow when driven directly from a GPIO pin. If the LED does not blink even though your program is running, the likely cause may be insufficient LED current.

Alternatives:

- Substitute an LED with a lower forward voltage.
- Drive the LED from a higher external rail through a transistor or buffer stage.
- Treat this first exercise as a logic-toggle test and verify the pin with measurement equipment before adding a driver stage.

## Before You Start

- Set `J5` to development mode by connecting pins 1 and 2.
- Use `J4` for manual reset when needed.
- Use the `VOL01` USB/Power module connected to `VOL00` in the same stacked arrangement shown in the main-page system photo.
- Connect both USB-C connectors through a USB hub.
- If you want to prevent SPI flash from auto-booting while experimenting, install `J6` and keep `J5` in development mode.

## Prepare the Volatco

Prepare the board in this order:

1. Connect the Volatco stack, `VOL00` plus `VOL01`, to the PC.
2. Start the `arrayForth 3 VOLATCO` program.
3. Type `HOST LOAD TALK`.
4. Type `SERIAL LOAD PLUG`.
5. Press the attached `J4` reset button.
6. Hit the space bar to set autobaud.

You should then see:

```text
pF/G144.03b1 12/21/18
hi
```

Then continue:

1. Type `20 DRIVE HI` to do the polyFORTH `9 LOAD`.
2. Type `AFORTH` and wait for the variables to be defined.
3. Type `1585 LIST` to inspect the LED demo block.

If block `1585` already exists, its `run` definition uses `2000` as the milliseconds per half cycle of the square wave. Edit that value if you want a different blink rate.

If block `1585` does not already exist on your system, type the LED demo code into the terminal manually, then save or run it before continuing.

If you make a mistake while editing, reset the Volatco, repeat the startup sequence, inspect block `1585`, and fix what you changed. If you do not use `FLUSH`, your edits are usually not written to mass storage.

## Wiring the LED

Use documented GPIO `715.17`.

1. Locate the header position that exposes signal `715.17`.
2. Connect `715.17` to the `550 ohm` resistor.
3. Connect the resistor to the LED anode.
4. Connect the LED cathode to one of the ground pins immediately adjacent to `715.17` on `J10`.
5. Place the LED and resistor on the breadboard in the same arrangement shown in the demo video.

If you prefer to sink current instead of source it, reverse the LED-resistor order and adjust your program logic accordingly.

With the `550 ohm` resistor and mini-red `2.0 V` LED, direct GPIO drive may not provide enough current from a `1.8 V` GPIO swing.

`715.17` is documented as a general-purpose `GPIO` signal. It is also noted as a pin shared with nearby analog nodes, so keep this test simple and avoid attaching additional circuitry to that signal at the same time.

## Suggested First Test

Use the existing LED blink program in polyForth block `1585` if it is present on your system.

If it is not present, enter the LED blink code manually at the terminal, then save or run it and continue.

The program does three things:

1. Configure `715.17` as an output.
2. Drive it high, wait a short time, then drive it low.
3. Repeat forever.

In this example, the blink interval is `2000` milliseconds per switch-state change.

## LED Demo Code

LED demo block:

```text
1585
 0 ( 715.17 Blink test)   STREAMER LOAD
 1 ASM[ # 715 NODE ERS # 0 org
 2
 3 : ms ( n)  for  999. for  415. for  unext  next next ;
 4 : run   2000. ( ms per half of square wave)
 5   dup begin  drop  x30000. !b  dup ms  x20000. !b  dup ms
 6     @b xA800. and until  warm ;   >BIN ]ASM
 7
 8 0 ARRAY MYP  207 ORGN 210 TO 710 TO 715 TO -1 ,
 9
10 207 STREAM[   ' MYP COURSE
11     FRAME[   715 +NODE  0 64 715 /PART
12        IO /B  715 ITS run /P   ]FRAME  ]STREAM
13   !SNORK
14
15  ok
```

If block `1585` is already present, use `1585 LIST` to confirm it matches this program. If it is not present, type this code into the terminal, then save or run it before continuing.

## Example Workflow

1. Power the board in development mode.
2. Prepare the stack and start arrayForth.
3. Inspect block `1585` with `1585 LIST`.
4. If the block exists, optionally edit the `run` definition.
5. If the block does not exist, type the LED demo code into the terminal manually, then save or run it.
6. If the block exists, type `1585 LOAD`.
7. Confirm that the program starts node `715`.
8. Observe `715.17` changing state at the programmed rate.
9. Confirm that the LED blinks steadily.

## Running the Program

If block `1585` is present, start the program from arrayForth with:

```text
1585 LOAD
```

This loads the code in block `1585` and starts it running.

Each time you enter `1585 LOAD`, node `715` is reprogrammed so you can edit `run` and load again.

## Change the Blink Rate

The useful part of this exercise is changing the blink period and loading it again.

In block `1585`, line 4 contains:

```text
: run   2000. ( ms per half of square wave)
```

The value `2000.` is the delay in milliseconds for each half cycle of the square wave. Lower values make the LED blink faster. Higher values make it blink slower.

Example:

- Find `2000.` and replace it with `500.` for a faster blink.
- One way to do that in the editor is:

```text
F 2000.
R 500.
```

- Load the program again with `1585 LOAD`.
- Watch the LED and confirm that the blink period changed.

If you do not use `FLUSH`, the edited value is usually not written to mass storage, so you can experiment without permanently changing the stored block.

You can also type `Q` while viewing the block shadow for the short note that describes what the demo is doing.

## Further Reading

For background on interactive Forth programming, Leo Brodie's *Starting Forth* is still the standard beginner text.

- From FORTH, Inc.: https://www.forth.com/starting-forth/
- PDF from FORTH, Inc.: https://www.forth.com/wp-content/uploads/2018/01/Starting-FORTH.pdf

## What Success Looks Like

- The LED blink code is available either in block `1585` or as code entered manually at the terminal.
- `arrayForth 3 VOLATCO`, serial services, and arrayForth are all loaded successfully.
- Typing `1585 LOAD` in arrayForth starts the program when block `1585` is present, or the manually entered code runs correctly.
- `715.17` changes state at the programmed interval.
- The LED blinks repeatedly without manual intervention.
- Resetting the board restarts the blink program cleanly.
- The board remains stable while the LED is connected.

## Demo Video

<figure>
  <video controls preload="metadata" style="width: 100%; max-width: 640px; height: auto;">
    <source src="../assets/volatco-gpio.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>Volatco GPIO blinking a mini-red LED during the tutorial test.</figcaption>
</figure>

## Troubleshooting

If the LED does not blink:

- Verify LED polarity.
- Verify the `550 ohm` resistor is in series with the LED.
- Confirm you are really connected to documented signal `715.17`.
- Confirm the board is in development mode while testing.
- Confirm the `arrayForth 3 VOLATCO` program was started.
- Confirm `HOST LOAD TALK` was run.
- Confirm `SERIAL LOAD` and `PLUG` were run.
- Reset the Volatco and press the space bar again to autobaud.
- Confirm `AFORTH` was run before using block `1585`.
- If block `1585` exists, run `1585 LOAD` again.
- If block `1585` does not exist, verify the LED demo code was typed correctly at the terminal and then saved or run.
- Verify the blink interval in `run`.
- Reset with `J4` and reload the program.
- The mini-red `2.0 V` LED on a `550 ohm` resistor may not receive enough current from a direct `1.8 V` GPIO output even when the pin is toggling correctly.
