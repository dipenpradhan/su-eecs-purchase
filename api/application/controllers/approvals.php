<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . 'libraries/REST_Controller.php';


/**
 * Class Orders
 *
 * @package         su-ecs-purchase
 * @subpackage      Rest API Server
 * @category        Controller
 * @author          Dipen Pradhan
 * @link            https://github.com/chriskacerguis/codeigniter-restserver
 */
class Approvals extends REST_Controller
{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        $this->load->database();
        $this->load->library('email');
        $email_config['protocol'] = 'smtp';
        $email_config['smtp_host'] = 'smtp.mailgun.org';
//        $config['smtp_port']    = '465';
        $email_config['smtp_timeout'] = '7';
        $email_config['smtp_user'] = 'postmaster@mailgun.dipenpradhan.com';
        $email_config['smtp_pass'] = '7c4c5163c00b86c8b18719fb1d5a66c5';
        $email_config['charset'] = 'utf-8';
        $email_config['newline'] = "\r\n";
        $email_config['mailtype'] = 'html'; // or html
        $email_config['validation'] = TRUE; // bool whether to validate email or not

        $this->email->initialize($email_config);
    }


    public function getApproval_get()
    {
        $id = $this->get('id');
        if (strlen($id) > 0) {
            $this->db->where('id', $id);
        } else {
            $this->response('id is a required parameter', REST_Controller::HTTP_BAD_REQUEST);
        }
        $orders = $this->db->get('orders')->result();
        $this->db->where('order_id', $id);
        $approvals = $this->db->get('approval')->result();

        foreach ($orders as $o) {
            $this->db->where('order_id', $o->id);
            $o->items = $this->db->get('order_product')->result();
        }
        foreach ($approvals as $a) {
            $this->db->where('approval_id', $a->id);
            $a->items = $this->db->get('approval_items')->result();
        }
        $order = $orders[0];
        $response = array('order' => $order);
        if (sizeof($approvals) > 0) {
            $approval = $approvals[0];
            $response['approval']=$approval;
        }
        $this->response($response, REST_Controller::HTTP_OK);

    }

}
