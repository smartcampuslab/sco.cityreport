package it.smartcommunitylab.cityreport.utils;

import org.joda.time.DateTime;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

import static org.joda.time.DateTimeZone.UTC;

public class JodaTimeDateAdapter {

    private static final DateTimeFormatter YYYY_MM_DD_DATE_TIME_FORMAT = DateTimeFormat.forPattern("yyyy-MM-dd");

    public static DateTime parseDate(String s) {
        return ISODateTimeFormat.dateOptionalTimeParser().parseDateTime(s).withZone(UTC);
    }

    public static String printDate(DateTime date) {
        if (date != null)
            return ISODateTimeFormat.dateTime().withZone(UTC).print(date);
        return null;
    }

    public static LocalDate parseLocalDate(String s) {
        return YYYY_MM_DD_DATE_TIME_FORMAT.parseLocalDate(s);
    }

    public static String printLocalDate(LocalDate date) {
        if (date != null)
            return YYYY_MM_DD_DATE_TIME_FORMAT.print(date);
        return null;
    }

}
