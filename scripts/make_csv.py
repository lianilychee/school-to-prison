"""
A python script to merge data from various CSV files.
"""

# import csv

with open('../datasets/Gaz_unsd_national.csv') as csvfile:
	spamreader = csv.reader(csvfile, delimiter = ',', quotechar='|')
	for row in spamreader:
		print ', '.join(row)

with open('../datasets/test.csv', 'w') as csvfile:
    spamwriter = csv.writer(csvfile, delimiter=' ',
                            quotechar=',', quoting=csv.QUOTE_MINIMAL)
    spamwriter.writerow(['Spam', 'Baked Beans'])
    spamwriter.writerow(['Spam', 'Wonderful Spam'])