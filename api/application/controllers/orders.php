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
class Orders extends REST_Controller
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

    /**
     *
     */
    public function placeOrder_post()
    {
        $this->load->view('professors');
        // Users from a data store e.g. database
        $this->db->select('id');
        $this->db->where('email', $this->post('prof_email'));
        $users = $this->db->get('user')->result();
        $user_id = '';
        if (sizeof($users) > 0) {
            $user_id = $users[0]->id;
        }

        $items = $this->post('items');

        $order_data = array(
            'status' => 'pending',
            'user_id' => $user_id,
            'project_name' => $this->post('project_name'),
            'student_name' => $this->post('student_name'),
            'student_email' => $this->post('student_email'),
            'prof_name' => $this->post('prof_name'),
            'prof_email' => $this->post('prof_email'),
            'date_needed' => $this->post('date_needed'),
            'vendor' => $this->post('vendor'),
            'user_type' => $this->post('user_type'),
            'total_price' => $this->post('total_price')
        );

        $this->db->trans_start();
        $this->db->insert('orders', $order_data);
        $order_id = $this->db->insert_id();
        foreach ($items as $prod) {
            $item_data = array(
                'order_id' => $order_id,
                'item_no' => $prod['item_no'],
                'qty' => $prod['qty'],
                'description' => $prod['description'],
                'purpose' => $prod['purpose'],
                'unit_price' => $prod['unit_price'],
                'total_price' => $prod['total_price']
            );
            $this->db->insert('order_product', $item_data);
        }

        $this->db->trans_complete();


        $response = array('order_id' => $order_id);


        $this->db->select('GROUP_CONCAT(email) AS emails');
        $this->db->like('type', 'approver');
        $finance_emails = $this->db->get('user')->result();

        $this->email->from('postmaster@mailgun.dipenpradhan.com', 'SU EECS Purchase System');

        $this->email->to($finance_emails[0]->emails);
//        var_dump($finance_emails);die();

        $this->email->subject('New Purchase Order #' . $order_id);
        $order_url = 'http://ecs-test.dipenpradhan.com/su-ecs-purchase/admin/finance/#/order/' . $order_id;
        $this->email->message(
            'New Order for Prof. '
            . $order_data['prof_name']
            . ' needed by ' . $order_data['date_needed']
            . '. Total Amount $' . $order_data['total_price']
            . '. View and Approve this order at <a href="' . $order_url . '">' . $order_url . '</a>'

        );

        $this->email->send();

//        echo $this->email->print_debugger();

        $this->response($response, REST_Controller::HTTP_OK);

    }

    public function approveOrder_post()
    {
        $items = $this->post('items');
        $approval_data = array(
            'order_id' => $this->post('order_id'),
            'req_no' => $this->post('req_no'),
            'delivery_address' => $this->post('delivery_address'),
            'delivery_attn' => $this->post('delivery_attn'),
            'chartstrings' => $this->post('chartstrings')
        );

        $this->db->trans_start();
        $this->db->insert('approval', $approval_data);
        $approval_id = $this->db->insert_id();
        foreach ($items as $a) {
            $item_data = array(
                'approval_id' => $approval_id,
                'item_no' => $a['item_no'],
                'fund' => $a['fund'],
                'dept' => $a['dept'],
                'program' => $a['program'],
                'acct' => $a['acct'],
                'project' => $a['project'],
                'activity' => $a['activity'],
                'bud_ref' => $a['bud_ref'],
                'dept_auth_sign' => $a['dept_auth_sign'],
                'amount' => $a['amount'],
            );
            $this->db->insert('approval_items', $item_data);
        }

        $this->db->set('status', 'processed');
        $this->db->where('id', $this->post('order_id'));
        $this->db->update('orders');

        $this->db->trans_complete();


//        $this->db->select('student_email,prof_email');
//        $this->db->where('id', $this->post('order_id'));
//        $order_emails = $this->db->get('order')->result();
        $this->db->select('GROUP_CONCAT(email) AS emails');
        $this->db->like('type', 'reviewer');
        $reviewer_emails = $this->db->get('user')->result();

        $this->email->from('postmaster@mailgun.dipenpradhan.com', 'SU EECS Purchase System');

        $this->email->to($reviewer_emails[0]->emails);
//        var_dump($finance_emails);die();

        $this->email->subject('Acknowledgement Required for Order #' . $this->post('order_id'));
        $approval_url = 'http://ecs-test.dipenpradhan.com/su-ecs-purchase/admin/#/approval/' . $approval_id;
        $this->email->message(
            'Acknowledgement required for Approval ID ' . $approval_id . '.' . ' View and Acknowledge this order at <a href="' . $approval_url . '">' . $approval_url . '</a>'
        );

        $this->email->send();
        $response = array('approval_id' => $approval_id);
        $this->response($response, REST_Controller::HTTP_OK);

    }

    public function getOrders_get()
    {
        $status = $this->get('type');
        $id = $this->get('id');
        if (strlen($status) > 0  && $status != 'all') {
            $this->db->where('status', $status);
        }
        if (strlen($id) > 0) {
            $this->db->where('id', $id);
        }
        $this->db->order_by('id', 'DESC');

        $orders = $this->db->get('orders')->result();
        foreach ($orders as $o) {
            $this->db->where('order_id', $o->id);
            $o->items = $this->db->get('order_product')->result();
        }
        $response = array('orders' => $orders);
        $this->response($response, REST_Controller::HTTP_OK);

    }

    public function getApprovedOrders_get()
    {
        $status = $this->get('type');
        $id = $this->get('id');
        if (strlen($status) > 0 && $status != 'all') {
            $this->db->where('status', $status);
        } else {
            $allowed_status = array('processed', 'ack');
            $this->db->where_in('status', $allowed_status);
        }
        if (strlen($id) > 0) {
            $this->db->where('id', $id);
        }
        $this->db->order_by('id', 'DESC');
        $orders = $this->db->get('orders')->result();
        foreach ($orders as $o) {
            $this->db->where('order_id', $o->id);
            $o->items = $this->db->get('order_product')->result();
        }
        $response = array('orders' => $orders);
        $this->response($response, REST_Controller::HTTP_OK);

    }

    public function ackOrder_get()
    {
        $id = $this->get('id');
        if (strlen($id) > 0) {
            $this->db->set('status', 'ack');
            $this->db->where('id', $id);
            $success = $this->db->update('orders');


            $this->db->select('student_email,prof_email');
            $this->db->where('id', $id);
            $order_emails = $this->db->get('orders')->result();


            $this->db->select('GROUP_CONCAT(email) AS emails');
            $this->db->like('type', 'reviewer');
            $reviewer_emails = $this->db->get('user')->result();

            $this->email->from('postmaster@mailgun.dipenpradhan.com', 'SU EECS Purchase System');

            if (strlen($order_emails[0]->student_email) > 0) {
                $list = array($order_emails[0]->student_email, $order_emails[0]->prof_email);
                $this->email->to($list);
            } else {
                $this->email->to($order_emails[0]->prof_email);
            }
            $this->email->cc($reviewer_emails[0]->emails);

            $this->email->subject('Acknowledgement for Order #' . $id);
            $this->email->message(
                'Your Order ID '.$id.' has been acknowledged.'
            );

            $this->email->send();
            $response = array('success' => $success);
            $this->response($response, REST_Controller::HTTP_OK);
        } else {
            $this->response('id is a required field', REST_Controller::HTTP_BAD_REQUEST);
        }


    }

}
