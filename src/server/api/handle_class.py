# --*-- encoding:utf-8 --*--
# 处理刚爬取好的数据，去重、去掉空行。

import os

root = 'course_info/课程'
res_lst = []

for (nowdir, sondir, files) in os.walk(root):
	for file in files:
		if 'txt' not in file:
			continue

		course_dict = {}
		with open(root+'/'+file, 'r', encoding='utf-8') as f:
			lines = f.readlines()
		for line in lines:
			line = line.strip()
			if len(line) == 0:
				continue
			if line not in course_dict:
				course_dict[line] = 1;

		with open('course_info/new_course/'+file+'.txt', 'w', encoding='utf-8') as f:
			for key,value in course_dict.items():
				f.write(str(key) + '\n')

		for key, value in course_dict.items():
			mystr = '{"major": "' + str(file.split('.')[0]) + '", ' + '"course": "' + str(key) + '"}'
			res_lst.append(mystr)

with open('course_info/course_list.txt', 'w', encoding='utf-8') as f:
	for i in range(len(res_lst)):
		f.write(res_lst[i])
		if i != len(res_lst)-1:
			f.write(',')