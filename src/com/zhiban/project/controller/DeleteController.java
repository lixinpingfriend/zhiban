package com.zhiban.project.controller;

import java.sql.Connection;

import javax.sql.DataSource;

import dinamica.Db;
import dinamica.GenericTransaction;
import dinamica.Jndi;
import dinamica.Recordset;

public class DeleteController extends GenericTransaction {

	public int service(Recordset inputParams) throws Throwable {

		// default return code (login OK)
		int rc = 0;
		// reuse superclass code
		super.service(inputParams);

		// get security datasource
		String jndiName = (String) getContext().getAttribute(
				"dinamica.security.datasource");
		if (jndiName == null)
			throw new Throwable(
					"Context attribute [dinamica.security.datasource] is null, check your security filter configuration.");

		// get datasource and DB connection
		DataSource ds = Jndi.getDataSource(jndiName);
		Connection conn = ds.getConnection();
		this.setConnection(conn);

		// recordset con los datos de la cuenta del usuario
		Recordset rs1 = null;

		try {
			Db db = getDb();
			String sql = getResource("delete.sql");
			System.out.println("sql: " + ":"
					+ inputParams.getString("plan_date"));
			sql = getSQL(sql, inputParams);
			System.out.println("sql: " + sql);
			db.exec(sql);
		} catch (Throwable e) {
			throw e;
		} finally {
			if (conn != null)
				conn.close();
		}
		return rc;

	}
}
