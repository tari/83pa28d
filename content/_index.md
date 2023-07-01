---
title: Welcome
---

Welcome, one and all, to Learn TI-83 Plus Assembly In 28 Days -- the
_ultimate_ (read: "only") guide for learning how to program the TI-83 Plus
graphing calculator. In this series of HTML files is all you will need to join
the ranks of expert programmers making cheap knock-offs of Game Boy and cell-
phone games.

## The Purpose Of This Guide

As you can guess from the title, this guide is set up so you can learn to
program the TI-83 Plus calculator in 28 days. This guide is intended so people
who have little or no experience in assembly can learn how to make calculator
programs. This guide will cover making straight ASM programs (called
"nostub"). <del>No Applications or Ion/MirageOS-compatible programs here. If
that is more to your liking, there are other references you can consult.</del>
ED: prod in the right direction for shells to be done.

## Why I Made This Guide

While the TI-83 Plus has been around for about three years, the amount of info
about programming it is depressingly low. I believe this is because most
people think that, because the TI-83 and the TI-83 Plus have similar model
numbers, then the almighty ASMGuru should be perfect for both of them. This is
a _bad_ idea, as the Plus has a very different structure than its predecessor.
Many of the programs in ASMGuru will not work correctly on the TI-83 Plus,
some may even cause a very hideous crash.

(Invisible anti-AsmGuru flame follows. Not really necessary anymore; kept for
hysterical reasons)[^asmguru]

[^asmguru]: [AsmGuru](https://www.ticalc.org/archives/files/fileinfo/69/6961.html)
            is another set of tutorials targeting assembly for TI calculators
            that was [first published several years prior](http://tistory.wikidot.com/asm-guru)
            to the [first version of this tutorial](http://tistory.wikidot.com/83pa28);
            in 1999 compared to this tutorial's 2002.

Furthermore--and I know I'm going to piss off at least a few of you--but I
think ASMGuru is a horribly written tutorial. For one thing, the tutorial
order barely has a shred of logic behind it (on the other hand, maybe splash
screens _are_ integral to learning about registers). Too, on the very first
page, he says he knows practically nothing about assembly (and damned if
that's not an understatement)...yet he wrote the (supposedly) definitive help
file on it. Hmmmm... applying that logic, since I know absolutely nothing
about performing a coronary bypass, I think I'll go teach a class at a medical
university. Yeah, that'd be a _great_ idea.

## What's In This Guide

A series of 28 tutorials about assembly programming, augmented with example
programs and graphics (which were made in MSPaint and Excel (yes, Excel. Laugh
if you want, but I'm telling you there's no better way to make rectangles and
lines), so don't get your hopes up for the next Van Gogh). I've tried to
present the material in a logical order: the most essential aspects of
assembly are covered in the first few days, with each successive day building
off the topics covered in the previous one.  
As I think that forcing you to scan thirty lines of code just to learn how to
add two numbers together is sadistic, every topic will be explained first in a
few paragraphs of simple English, followed by heavily commented example
programs.

## How To Use This Guide

Don't be under the impression that you have a schedule to follow. If you can
go through eight lessons in two hours, go ahead. If you feel you have to spend
a few days repeatedly going over one section to understand it totally, no
problem. Calling each lesson a "day" is merely this guide's "gimmick": I
thought it would be more flavorful than just going "Lesson 6...Lesson
7...Lesson 8..."

Think you're ready? Then go straight to [Day 1]({{% ref "/lesson/week1/day01/index.md" %}}).
You might also want to check
out the [Formatting used in this guide]({{% ref "format.md" %}}).

## History & Legal

This is version 3.0 of "Learn TI-83 Plus Assembly In 28 Days." Versions
up to 2.0 were written by Sean "Sigma" McLaughlin, most recently published
in 2004. While the substantial content of this tutorial series remains
accurate now, 10 years later, there remain certain factual, typographic and
other errors. This version is the result of a team effort to correct those
errors and in general update this tutorial for the fifth decade.[^posix]

### Previous Versions

 * Version 2.0: published May 10, 2004 by Sean McLaughlin.
 * Version 3.0 and later: an ongoing effort by numerous contributors,
   first set up in 2012 and begun in earnest in mid-2014.
   You can always find the latest version at
   <https://gitlab.com/taricorp/83pa28d>.

For information on the authors, refer to the [acknowledgements] page.

This writing is licensed under the GNU Free Documentation License,
which grants you the right to copy and redistribute it freely. You may
also modify it and distribute those modifications, subject to certain
restrictions. Refer to the [full license text][gfdl] for details.

[acknowledgements]: {{< ref "credit.md" >}}
[gfdl]: {{< ref "gfdl.md" >}}

### Warranty disclaimer

THIS DOCUMENT IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS DOCUMENT, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

That is to say: while we have attempted to ensure that the information
in this tutorial is accurate and safe, we cannot be held responsible for
any damage or injury sustained as a result of its use.

[^posix]: Reckoned of course by UNIX time, the 2010s being the fifth decade
since the UNIX epoch (which begins at the beginning of 1970).
