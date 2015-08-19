package com.zhiban.project.controller;

import dinamica.Db;
import dinamica.GenericTableManager;
import dinamica.Recordset;

public class InsertMaster3 extends GenericTableManager {

	public int service(Recordset inputParams) throws Throwable {
		String insert = getSQL(getResource("insert.sql"), inputParams);
		getDb().exec(insert);
		int rc = 0;
		super.service(inputParams);

		String colNames = getConfig().getConfigValue("colname");
		String sqlFiles = getConfig().getConfigValue("sql-template");

		if (colNames != null && colNames.length() > 0 && sqlFiles != null
				&& sqlFiles.length() > 0) {
			String[] colNamesA = colNames.split(";"); // 多个语句体用分号(;)分隔
														// "xxx1,yyy1;xxx2,yyy2"
			String[] sqlFilesA = sqlFiles.split(";"); // SQL语句

			if (colNamesA.length != sqlFilesA.length) {
				throw new Throwable("字段与语句数量不对应，请检查！");
			}
			for (int i = 0; i < colNamesA.length; i++) {
				String sqlFile = sqlFilesA[i];
				String sql = getSQL(getResource(sqlFile), inputParams);
				save(sql, colNamesA[i]);
			}
		}
		String insert1 = getSQL(getResource("insert_log.sql"), inputParams);
		getDb().exec(insert1);
		return rc;

	}

	public void save(String sql, String colNames) throws Throwable {

		Db db = getDb();
		String[] colNameA = colNames.split(","); // 单语句体中,多个字段,用逗号(,)分隔
													// "xxx1,yyy1"
		Recordset detail = new Recordset();
		for (int i = 0; i < colNameA.length; i++) {
			detail.append(colNameA[i], java.sql.Types.VARCHAR);
		}

		if (getRequest().getParameterValues(colNameA[0]) != null) {/* 先判断值是否存在 */
			int recordCount = getRequest().getParameterValues(colNameA[0]).length;
			for (int i = 0; i < recordCount; i++) {
				detail.addNew();
				for (int j = 0; j < colNameA.length; j++) {
					String colValue[] = getRequest().getParameterValues(
							colNameA[j]);
					if (colValue != null && colValue[i] != null
							&& colValue[i].trim().length() > 0) {
						detail.setValue(colNameA[j], colValue[i].trim());
					} else {
						detail.setValue(colNameA[j], null);
					}
				}
				String cmd = getSQL(sql, detail);
				db.addBatchCommand(cmd);
			}
			db.exec();
		}
	}
}