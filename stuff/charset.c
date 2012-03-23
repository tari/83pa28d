#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>

typedef int bool;

void	display_syntax(void);
bool	getch_cmdline(unsigned char *);
bool	getch_file(unsigned char *);
void error(int);

enum { err_help = 0, err_args, err_fileio, err_parse };
enum { false = 0, true };

FILE * file_src, * file_dest;
unsigned char	charset[32] = { 0 };
char **gsz_argv;

int	main(int n_argc, char *sz_argv[])
{
	unsigned char	ch_input,
				ch_hex1,
				ch_hex2;

	bool (*fp_input)(unsigned char *);

	int	i,
		j;

	gsz_argv = sz_argv;

	if (n_argc == 1)
		error(err_help);

	if (n_argc != 4)
		error(err_args);

	file_dest = fopen(sz_argv[3], "w");
	if (file_dest == NULL)
	{
		fprintf(stderr, "%s: ", sz_argv[3]);
		error(err_fileio);
	}

	if (stricmp("-s", sz_argv[1]) == 0)
		fp_input = getch_cmdline;
	else if (stricmp("-f", sz_argv[1]) == 0)
	{
		file_src = fopen(sz_argv[2], "r");
		if (file_src == NULL)
		{
			fprintf(stderr, "%s: ", sz_argv[2]);
			error(err_fileio);
		}
		fp_input = getch_file;
	}
	else
		error(err_args);

	while (fp_input(&ch_input))
	{
		if (ch_input == '\\')
		{
			if (!fp_input(&ch_input))
				error(err_parse);
			else if (ch_input == 'x' || ch_input == 'X')
			{
				if(!(fp_input(&ch_hex1) && fp_input(&ch_hex2)));
					error(err_parse);

				if (!(isxdigit(ch_hex1) && isxdigit(ch_hex2)))
					error(err_parse);
					
				ch_hex1 = toupper(ch_hex1);
				ch_hex2 = toupper(ch_hex2);
				ch_hex1 = (ch_hex1 <= '9') ? ch_hex1 - '0' : ch_hex1 - 'A' + 10;
				ch_hex2 = (ch_hex2 <= '9') ? ch_hex2 - '0' : ch_hex2 - 'A' + 10;
				ch_input = ch_hex1 * 16 + ch_hex2;
			}
		}

		charset[ch_input / 8] |= (0x80 >> (ch_input % 8));
	}

	for (i = 0; i < 32; i++)
	{
		if (i % 4 == 0)
			fprintf(file_dest, ".db\t");
			
		fprintf(file_dest, "%%");
		for (j = 7; j >= 0; j--)
			fprintf(file_dest, "%d", (charset[i] >> j) & 1);

		fprintf(file_dest, (i % 4 == 3) ? "\n" : ", ");
	}

	exit(0);
}

void error(int n_error_val)
{
	switch (n_error_val)
	{
		case err_help:
			display_syntax();
			break;
		case	err_args:
			fprintf(stderr, "Error: Bad commmand line args\n");
			display_syntax();
			break;
		case	err_fileio:
			fprintf(stderr, "Error: Couldn't open this file\n");
			break;
		case	err_parse:
			fprintf(stderr, "Error: Misused '\\'");
			break;
		default:
			fprintf(stderr, "Unknow error");
	}

	exit(n_error_val);
}

bool	getch_cmdline(unsigned char * pch_target)
{
	static int	index = 0;

	*pch_target = gsz_argv[2][index];
	++index;

	return (*pch_target == '\0') ? false : true;
}

bool getch_file(unsigned char * pch_target)
{
	*pch_target = fgetc(file_src);

	return (feof(file_src)) ? false : true;
}

void	display_syntax(void)
{
	fprintf(stderr, "CHARSET -s \"string\" outfile\nCreates a 256-bit character set "
				 "from a string entered on the command line.\nstring\t\tString to "
				 "create the character set from. MUST be\n\t\tin double quotes.\n"
				 "\t\tCan use these escape sequences:\n\t\t\\\\\tBackslash\n\t\t"
				 "\\\'\tApostrophe\n\t\t\\\"\tDouble quote\n\t\t\\xNN\tCharacter "
				 "with ASCII code '0xNN'.\n\t\t\tTHERE MUST BE TWO HEXITS!\n"
				 "outfile\t\tThe file to output to.\n\n"
				 "CHARSET -f infile outfile\nCreates a 256-bit character set from "
				 "a text file.\ninfile\t\tFile to create the character set from.\n"
				 "outfile\t\tThe file to output to.\n\n");
}

