---
title: System Flags
weight: 30
---

Not an exhaustive list, but all the useful ones have been given.

<table class="Info">
<colgroup>
<col style="width: 20%" />
<col style="width: 20%" />
<col style="width: 20%" />
<col style="width: 20%" />
<col style="width: 20%" />
</colgroup>
<thead>
<tr class="header Heading">
<th>Flag</th>
<th>Value</th>
<th>IY Offset</th>
<th>Value</th>
<th>Effect</th>
</tr>
</thead>
<tbody>
<tr class="odd" data-valign="top">
<td class="SubHeading">TrigDeg</td>
<td>2</td>
<td class="SubHeading">TrigFlags</td>
<td>0</td>
<td>0 - Radian Mode<br />
1 - Degree Mode</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">DonePrgm</td>
<td>5</td>
<td class="SubHeading">DoneFlags</td>
<td>0</td>
<td>1 - Display "Done" after program</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">PlotLoc</td>
<td>1</td>
<td rowspan="2" class="SubHeading">PlotFlags</td>
<td rowspan="2">2</td>
<td>0 - Graph and draw routines sent to screen and PlotSScreen<br />
1 - Graph and draw routines sent to screen only.</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">PlotDisp</td>
<td>2</td>
<td>0 - Homescreen is displayed<br />
1 - Graph screen is displayed.</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">GrfFuncM</td>
<td>4</td>
<td rowspan="4" class="SubHeading">GrfModeFlags</td>
<td rowspan="4">2</td>
<td>1 - Function graphing mode</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">GrfPolarM</td>
<td>5</td>
<td>1 - Polar graphing mode</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">GrfParamM</td>
<td>6</td>
<td>1 - Parametric graphing mode</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">GrfRecurM</td>
<td>7</td>
<td>1 - Recursive (Sequence) graphing mode</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">GraphDraw</td>
<td>0</td>
<td class="SubHeading">GraphFlags</td>
<td>3</td>
<td>1 - Graph must be redrawn<br />
0 - Graph is okay.</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">GrfDot</td>
<td>0</td>
<td rowspan="7" class="SubHeading">GrfDBFlags</td>
<td rowspan="7">4</td>
<td>1 - Dot graph mode<br />
0 - Connected graph mode</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">GrfSimul</td>
<td>1</td>
<td>1 - Simultaneous graphing<br />
0 - Sequential graphing</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">GrfGrid</td>
<td>2</td>
<td>1 - Grid displayed<br />
0 - No grid</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">GrfPolar</td>
<td>3</td>
<td>1 - Polar coordinates<br />
0 - Rectangular coordinates</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">GrfNoCoord</td>
<td>4</td>
<td>1 - Don't display coordinates<br />
0 - Display coordinates</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">GrfNoAxis</td>
<td>5</td>
<td>1 - Don't display the axis<br />
0 - Display the axis</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">GrfLabel</td>
<td>6</td>
<td>1 - Display axis labels<br />
0 - Don't display axis labels</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">TextEraseBelow</td>
<td>1</td>
<td rowspan="4" class="SubHeading">TextFlags</td>
<td rowspan="4">5</td>
<td>1 - When displaying a small character, erase the pixels below
it.</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">TextScrolled</td>
<td>2</td>
<td>1 - Text display caused screen to scroll</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">TextInverse</td>
<td>3</td>
<td>1 - Display text as white-on-black.</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">TextInsMode</td>
<td>4</td>
<td>1 - Insert mode<br />
0 - Overstrike mode</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">ApdAble</td>
<td>2</td>
<td rowspan="2" class="SubHeading">ApdFlags</td>
<td rowspan="2">8</td>
<td>1 - APD™ is active</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">ApdRunning</td>
<td>3</td>
<td>1 - APD™ clock is running</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">OnRunning</td>
<td>3</td>
<td rowspan="2" class="SubHeading">OnFlags</td>
<td rowspan="2">9</td>
<td>1 - Calculator is on.</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">OnInterrupt</td>
<td>4</td>
<td>1 - The [ON] key was pressed</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">StatsValid</td>
<td>6</td>
<td rowspan="2" class="SubHeading">StatFlags</td>
<td rowspan="2">9</td>
<td>1 - Statistics results are valid</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">StatANSDisp</td>
<td>7</td>
<td>1 - Display statistics results</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">FmtExponent</td>
<td>0</td>
<td rowspan="8" class="SubHeading">FmtFlags</td>
<td rowspan="8">10</td>
<td>1 - Show exponent<br />
0 - No exponent</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">FmtEng</td>
<td>1</td>
<td>1 - Engineering notation<br />
0 - Scientific Notation</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">FmtHex</td>
<td>2</td>
<td rowspan="3">If FmtHex and FmtOct are 1, then
<p><br />
1 - Display answer as x/y<br />
0 - Display answer as x°y'z"</p></td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">FmtOct</td>
<td>3</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">FmtBin</td>
<td>4</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">FmtReal</td>
<td>5</td>
<td>1 - Real math mode</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">FmtRect</td>
<td>6</td>
<td>1 - Rectangular complex mode (a+b<em>i</em>)</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">FmtPolar</td>
<td>7</td>
<td>1 - Polar complex mode (r<em>e</em>^θ<em>i</em>)</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">CurAble</td>
<td>2</td>
<td rowspan="3" class="SubHeading">CurFlags</td>
<td rowspan="3">12</td>
<td>1 - Cursor flash is enabled</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">CurOn</td>
<td>3</td>
<td>1 - Cursor is showing</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">CurLock</td>
<td>4</td>
<td>1 - Cursor is locked off</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">AppTextSave</td>
<td>1</td>
<td rowspan="2" class="SubHeading">AppFlags</td>
<td rowspan="2">13</td>
<td>1 - Written characters are saved in the TextShadow buffer.</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">AppAutoScroll</td>
<td>2</td>
<td>1 - Screen automatically scrolls when the 5x7 font is written and
goes beyond the edge of the screen.</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">WebMode</td>
<td>0</td>
<td rowspan="4" class="SubHeading">SeqFlags</td>
<td rowspan="4">15</td>
<td>1 - Web mode<br />
0 - Normal sequence mode</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">SeqUV</td>
<td>2</td>
<td>1 - Sequence mode: U vs. V</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">SeqVW</td>
<td>3</td>
<td>1 - Sequence mode: V vs. W</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">SeqUW</td>
<td>4</td>
<td>1 - Sequence mode: U vs. W</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">IndicRun</td>
<td>0</td>
<td rowspan="2" class="SubHeading">IndicFlags</td>
<td rowspan="2">18</td>
<td>1 - Run indicator is on.<br />
0 - Run indicator is off</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">IndicOnly</td>
<td>2</td>
<td>1 - Interrupt handler only checks run indicator (don't process APD™,
blink the cursor, or scan for keys).</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">Shift2nd</td>
<td>3</td>
<td rowspan="5" class="SubHeading">ShiftFlags</td>
<td rowspan="5">18</td>
<td>1 - [2nd] key was pressed.</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">ShiftAlpha</td>
<td>4</td>
<td>1 - [ALPHA] key was pressed.</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">ShiftLwrAlph</td>
<td>5</td>
<td>1 - Lowercase mode set.</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">ShiftALock</td>
<td>6</td>
<td>1 - Alpha lock is active</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">ShiftKeepAlph</td>
<td>7</td>
<td>1 - Alpha lock cannot be canceled.</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">AutoFill</td>
<td>4</td>
<td rowspan="3" class="SubHeading">TblFlags</td>
<td rowspan="3">19</td>
<td>1 - Ask for independent variable in table<br />
0 - Fill table automatically.</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">AutoCalc</td>
<td>5</td>
<td>1 - Ask to calculate dependent variable in table.<br />
0 - Calculate automatically</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">ReTable</td>
<td>6</td>
<td>1 - Table has to be recalculated.<br />
0 - Table is okay.</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">GrfSplit</td>
<td>0</td>
<td rowspan="4" class="SubHeading">SGrFlags</td>
<td rowspan="4">20</td>
<td>1 - Horizontal split mode</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">VertSplit</td>
<td>1</td>
<td>1 - Vertical split mode</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">GrfSplitOverride</td>
<td>3</td>
<td>1 - Ignore graph split flag</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">TextWrite</td>
<td>7</td>
<td>1 - Small font writes to PlotSScreen<br />
0 - Small font writes to display.</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">LwrCaseActive</td>
<td>3</td>
<td class="SubHeading">AppLwrCaseFlag</td>
<td>36</td>
<td>1 - Lowercase enabled. Press [ALPHA][ALPHA] to access lowercase
characters.</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">FullScrnDraw</td>
<td>2</td>
<td class="SubHeading">ApiFlg4</td>
<td>43</td>
<td>1 - Allows graphics commands to use row 0 and column 95</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">FracDrawLFont</td>
<td>2</td>
<td rowspan="2" class="SubHeading">FontFlags</td>
<td rowspan="2">50</td>
<td>1 - Routines that normally display small font now display large
font.</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">CustomFont</td>
<td>7</td>
<td>1 - Small font drawing routines use your own characters.</td>
</tr>
<tr class="even" data-valign="top">
<td class="SubHeading">BufferOnly</td>
<td>0</td>
<td rowspan="2" class="SubHeading">PlotFlag3</td>
<td rowspan="2">60</td>
<td>1 - Drawing routines written to PlotSScreen instead of display.</td>
</tr>
<tr class="odd" data-valign="top">
<td class="SubHeading">UseFastCirc</td>
<td>4</td>
<td>1 - Circles drawn in sections simultaneously.<br />
0 - Circles drawn in a circular direction.</td>
</tr>
<tr class="even" data-valign="top">
<td colspan="2"> </td>
<td class="SubHeading">Asm_Flag1<br />
Asm_Flag2<br />
Asm_Flag3</td>
<td>33<br />
34<br />
35<br />
</td>
<td>Not used by the calculator. Use these for your own personal
use.</td>
</tr>
</tbody>
</table>