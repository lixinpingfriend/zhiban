package com.zhiban.project.controller;

import dinamica.GenericTableManager;
import dinamica.Recordset;

public class InsertController extends GenericTableManager {

	public int service(Recordset inputParams) throws Throwable {
		String insert = getSQL(getResource("insert.sql"), inputParams);
		getDb().exec(insert);
		int rc = 0;
		super.service(inputParams);
		return rc;

	}

}
