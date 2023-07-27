import axios from "axios";
import blogTables from '../assets/data/blogTable.json';
import { getRoutePath } from '../lib/getRoute';
import { Blog, BlogTable, Post } from "../interfaces/blogDataTypes";

let cancelTokenSource = axios.CancelToken.source();
const dataMap = convertToMap(blogTables);

function convertToMap(blogTables: BlogTable[]): Map<string, Map<string, Post>> {
  const resultMap = new Map<string, Map<string, Post>>();

  for (const blogTable of blogTables) {
    const { tableName, blogList } = blogTable;
    const innerMap = new Map<string, Post>();

    for (const post of blogList) {
      innerMap.set(post.name, post);
    }

    resultMap.set(tableName, innerMap);
  }

  return resultMap;
}

export const getStringResource = async (filePath: string): Promise<string> => {
  try {
    cancelTokenSource.cancel('New request, cancel previous');
    cancelTokenSource = axios.CancelToken.source();

    const response = await axios.get(filePath);
    return response.data;
  } catch (error) {
    console.error('Failed to get string resourse:' + filePath, error);
    throw new Error('ERROR: Get resource failed');
  }
}

export const getBlogTable = (): BlogTable[] => {
  return blogTables;
}

export const getFirstDocPath = (): string => {
  const table = blogTables[0];
  return table.tableName + '/' + table.blogList[0].name;
}

export const getBlogContent = async (table: string, blog: string): Promise<Blog> => {
  const blogPath = table + '/' + blog + '.html';
  const newBlog = {
    content: await getStringResource(getRoutePath('content', blogPath)),
    frontMatter: dataMap.get(table)?.get(blog)?.frontMatter || {},
  }
  return newBlog;
}
