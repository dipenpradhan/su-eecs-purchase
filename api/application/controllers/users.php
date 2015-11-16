<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . 'libraries/REST_Controller.php';

/**
 * Class Users
 *
 * @package         su-ecs-purchase
 * @subpackage      Rest API Server
 * @category        Controller
 * @author          Dipen Pradhan
 * @link            https://github.com/chriskacerguis/codeigniter-restserver
 */
class Users extends REST_Controller
{

    function __construct()
    {
        parent::__construct();

        $this->load->database();
    }

    public function professors_get()
    {
        $this->db->select('name,email');
        $this->db->like('type', 'professor');
        $users = $this->db->get('user')->result();
        $profs = array('professors' => $users);

        if ($users) {
            // Set the response and exit
            $this->response($profs, REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        } else {
            // Set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No users were found'
            ], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
        }
    }


}
