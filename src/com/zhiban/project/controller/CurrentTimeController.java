package com.zhiban.project.controller;

import java.util.Date;

import dinamica.GenericTransaction;
import dinamica.Recordset;


public class CurrentTimeController extends GenericTransaction {

	/*
	 * (non-Javadoc)
	 * 
	 * @see dinamica.GenericTransaction#service(dinamica.Recordset)
	 */
	public int service(Recordset inputParams) throws Throwable {
		Recordset rs1 = null;
		int rc = 0;
		try {
			rc = super.service(inputParams);
		} catch (Throwable e) {
			throw e;
		} finally {
		}
		return rc;

	}
}