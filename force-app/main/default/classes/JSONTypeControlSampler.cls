public class JSONTypeControlSampler {
    private static String serializedJSON1;
    private static String serializedJSON2;
	
    public virtual class JSONBodyConstructor {
        public JSONBodyConstructor(String lastName, String firstName, Integer age, String userName) {
            this.lastName 	= lastName;
            this.firstName 	= firstName;
            this.age		= age;
            this.userName	= userName;
        }
        public String lastName;
        public String firstName;
        public Integer age;
        public String userName;
    }
    
	//@JsonAccess(serializable='never' deserializable='never')
    public class JSONNonConvertable extends JSONBodyConstructor {
        public JSONNonConvertable(String lastName, String firstName, Integer age, String userName) {
        	super(lastName, firstName, age, userName);    
        }
    }
    
    //@JsonAccess(serializable='always' deserializable='always')
    public class JSONConvertable extends JSONBodyConstructor{
        public JSONConvertable(String lastName, String firstName, Integer age, String userName) {
        	super(lastName, firstName, age, userName);    
        }
    }
    
    /* ***
     * Name: mainRun
     * Description: invokes all the needed methods at once
     * *** */
    public static void mainRun() {
        JSONTypeControlSampler.checkRestrictionsSerialize1();
        JSONTypeControlSampler.checkRestrictionsDeserialize1();
        JSONTypeControlSampler.checkRestrictionsSerialize2();
        JSONTypeControlSampler.checkRestrictionsDeserialize2();
    }
    
    /* ***
     * Name: checkRestrictionsSerialize1
     * Description: try to compose an object an serialize to JSON
     * *** */
    public static void checkRestrictionsSerialize1() {
        JSONTypeControlSampler.JSONConvertable serializeNow = 
            new JSONTypeControlSampler.JSONConvertable(
            	'John',
            	'Jo',
           		29,
            	'jojo@mydomain.com'
            );
        
        try {
            serializedJSON1 = JSON.serialize(serializeNow);
            System.debug('checkRestrictionsSerialize1 : ' + serializedJSON1);
        } catch (JSONException e) {
            System.debug('checkRestrictionsSerialize1 : ' + e.getMessage());
        }
    }
    
    /* ***
     * Name: checkRestrictionsDeserialize1
     * Description: try to deserialize from JSON
     * *** */
    public static void checkRestrictionsDeserialize1() {
        JSONTypeControlSampler.JSONConvertable serializeNow;
        
        try {
            serializeNow = (JSONTypeControlSampler.JSONConvertable)JSON.deserialize(
                serializedJSON1, 
                JSONTypeControlSampler.JSONConvertable.class
            );
            System.debug('checkRestrictionsDeserialize1 : ' + serializeNow);
        } catch (JSONException e) {
            System.debug('checkRestrictionsDeserialize1 : ' + e.getMessage());
        }
    }
    
    /* ***
     * Name: checkRestrictionsSerialize2
     * Description: try to compose an object an serialize to JSON. Catch a JSONException
     * *** */
    public static void checkRestrictionsSerialize2() {
        JSONTypeControlSampler.JSONNonConvertable serializeNow = 
            new JSONTypeControlSampler.JSONNonConvertable(
            	'John',
            	'Jo',
           		29,
            	'jojo@mydomain.com'
            );
        
        try {
            serializedJSON2 = JSON.serialize(serializeNow);
            System.debug('checkRestrictionsSerialize2 : ' + serializedJSON2);
        } catch (JSONException e) {
            System.debug('checkRestrictionsSerialize2 : ' + e.getMessage());
        }
    }
    
    /* ***
     * Name: checkRestrictionsDeserialize2
     * Description: try to deserialize from JSON. Catch a JSONException
     * *** */
    public static void checkRestrictionsDeserialize2() {
        JSONTypeControlSampler.JSONNonConvertable serializeNow;
        
        try {
            serializeNow = (JSONTypeControlSampler.JSONNonConvertable)JSON.deserialize(
                serializedJSON1, 
                JSONTypeControlSampler.JSONNonConvertable.class
            );
            System.debug('checkRestrictionsDeserialize2 : ' + serializeNow);
        } catch (JSONException e) {
            System.debug('checkRestrictionsDeserialize2 : ' + e.getMessage());
        }
    }
}