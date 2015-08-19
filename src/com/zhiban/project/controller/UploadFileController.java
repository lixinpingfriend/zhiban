package com.zhiban.project.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.tomcat.util.http.fileupload.FileItem;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.apache.tomcat.util.http.fileupload.disk.DiskFileItemFactory;
import org.apache.tomcat.util.http.fileupload.servlet.ServletFileUpload;

import com.ccms.context.InitializerServlet;
import com.ccms.util.mms.MmsUtil;

import dinamica.Db;
import dinamica.GenericTransaction;
import dinamica.Recordset;
import dinamica.StringUtil;

public class UploadFileController extends GenericTransaction {

	public int service(Recordset inputParams) throws Throwable {
		int rc = super.service(inputParams);
		FileInputStream fs = null;
		HttpServletRequest request = this.getRequest();
		request.setCharacterEncoding("utf-8"); // 设置编码
		// 获得磁盘文件条目工厂
		DiskFileItemFactory factory = new DiskFileItemFactory();
		// 获取文件需要上传到的路径
		String path = request.getRealPath("/test");

		factory.setRepository(new File(path));
		// 设置 缓存的大小，当上传文件的容量超过该缓存时，直接放到 暂时存储室
		factory.setSizeThreshold(1024 * 1024);
		// 高水平的API文件上传处理
		ServletFileUpload upload = new ServletFileUpload(factory);
		try {
			// 可以上传多个文件
			List<FileItem> list = (List<FileItem>) upload
					.parseParameterMap(request);
			System.out.println("list:" + list);
			for (FileItem item : list) {
				String name = item.getFieldName();
				if (item.isFormField()) {
					String value = item.getString();
				} else {
					String value = item.getName();
					int start = value.lastIndexOf("\\");
					String filename = value.substring(start + 1);
					System.out.println("filename" + value);
					System.out
							.println("getInputStream" + item.getInputStream());

				}
			}
		} catch (FileUploadException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
		}

		try {

			System.out.println("fileName:" + inputParams.getString("filename"));
			String filePath = inputParams.getString("file");
			System.out.println("filePath" + filePath);
			Db db = getDb();
			// 获取扩展名
			Date d = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat(
					"yyyy_MM_dd_HH_mm_ss_SSS");
			String _timestamp = sdf.format(d);
			String fileName = MmsUtil.formatRequestEncoding(inputParams
					.getString("file.filename"));
			System.out.println("fileName" + fileName);
			String extendName = fileName.substring(
					fileName.lastIndexOf(".") + 1).toLowerCase();
			fileName = _timestamp + "." + extendName;
			String fileType = "doc";
			// 保存文件
			ServletContext context = InitializerServlet.getContext();
			String savePath = context.getInitParameter("upload-dir");

			File file = new File(filePath);
			long fileSize = file.length();
			String insertSql = getSQL(getResource("insert_attach.sql"),
					inputParams);
			insertSql = StringUtil.replace(insertSql, "${file_name}", fileName);
			insertSql = StringUtil.replace(insertSql, "${file_path}", "mms"
					+ File.separator + fileName);
			insertSql = StringUtil.replace(insertSql, "${file_size}", fileSize
					+ "");
			insertSql = StringUtil.replace(insertSql, "${file_type}", fileType);

			byte[] buff = new byte[1024 * 20];
			int count = 0;
			fs = new FileInputStream(file);
			FileOutputStream fileOutputStream = new FileOutputStream(savePath
					+ File.separator + "mms" + File.separator + fileName);
			while ((count = fs.read(buff)) != -1) {
				fileOutputStream.write(buff, 0, count);
			}
			fs.close();
			fs = null;
			db.exec(insertSql);
			Recordset _totalRecordset = new Recordset();
			publish("tuid", _totalRecordset);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		} finally {
			if (null != fs) {
				fs.close();
			}
		}
		return rc;
	}
}
